import version1Schema from '../models/lists.schema.v1.json';
import version2Schema from '../models/lists.schema.v2.json';
import Villager from '../models/villager.model';
import VillagerList from '../models/villagerlist.model';
import VillagerListV1 from '../models/villagerlist.model.v1.js';
import VillagersRepository from '../repository/villagers.repository';
import Ajv from 'ajv';
import nanoid from 'nanoid';

export default class AppStateService {
	private _currentProfile = '';
	private readonly validator = new Ajv();

	public get currentLoadedProfileId(): string {
		return this._currentProfile;
	}
	public set currentLoadedProfileId(newId: string) {
		this._currentProfile = newId;
	}

	public getLists(): VillagerList[] {
		return this._lists;
	}

	public getListById(id: string): VillagerList {
		return this._lists.find(l => l.id === id);
	}

	public addNewList(): VillagerList {
		const tempLists = this._lists;
		const newList = {
			title: 'New List',
			id: nanoid(),
			members: []
		};
		tempLists.push(newList);
		this._lists = tempLists;
		return newList;
	}

	public renameList(listId: string, newTitle: string): VillagerList {
		const tempLists = this._lists;
		tempLists
			.find(l => l.id === listId)
			.title = newTitle;
		this._lists = tempLists;
		return this.getListById(listId);
	}

	public deleteList(id: string): void {
		this._lists = this._lists.filter(l => l.id !== id);
	}

	public clearAllLists(): void {
		this._lists = [];
	}

	public addVillagerToList(villagerToAdd: Villager, listId: string): void {
		if (this.villagerIsInList(villagerToAdd.id, listId)) {
			return;
		}
		const tempLists = this._lists;
		const listToAddTo: VillagerList = tempLists.find(l => l.id === listId);
		listToAddTo.members.push(villagerToAdd);
		listToAddTo.members.sort((a, b) => (a.id > b.id) ? 1 : -1);
		this._lists = tempLists;
	}

	public removeVillagerFromList(villagerIdToRemove: string, listId: string): void {
		const tempLists = this._lists;
		const listToRemoveFrom: VillagerList = tempLists.find(l => l.id === listId);
		listToRemoveFrom.members = listToRemoveFrom.members
			.filter(v => v.id !== villagerIdToRemove);
		this._lists = tempLists;
	}

	public listsAreEmpty(): boolean {
		return this._lists.length <= 0;
	}

	public villagerIsInList(villagerId: string, listId: string): boolean {
		return !this.listsAreEmpty()
			&& this.getListById(listId)
				.members
				.map(v => v.id)
				.includes(villagerId);
	}

	public aProfileIsLoaded(): boolean {
		return this._currentProfile !== '';
	}

	public overrideLists(lists: VillagerList[]): void {
		this._lists = lists;
	}

	public parseAndSerializeJSONToLists(listsJSONString: string): VillagerList[] {
		const parsedLists: VillagerList[] = JSON.parse(listsJSONString);
		return parsedLists.map(list => ({
			id: list.id,
			title: list.title,
			members: list.members.map(v => Villager.serialize(v)),
		}));
	}

	private set _lists(newLists: VillagerList[]) {
		localStorage.lists = JSON.stringify(newLists);
	}

	private get _lists(): VillagerList[] {
		let parsedLists;
		try {
			parsedLists = JSON.parse(localStorage.lists);
		} catch {
			return this.initEmptyLists();
		}

		if (this.isVersion2(parsedLists)) {
			// do nothing special
		} else if (this.isVersion1(parsedLists)) {
			localStorage.lists = JSON.stringify(this.convertVersion1ToVersion2(parsedLists));
		} else {
			return this.initEmptyLists();
		}
		return this.parseAndSerializeJSONToLists(localStorage.lists);
	}

	private initEmptyLists(): VillagerList[] {
		localStorage.lists = '[]';
		return [];
	}

	private isVersion1(lists): boolean {
		return this.validator.validate(version1Schema, lists) as boolean;
	}

	private isVersion2(lists): boolean {
		return this.validator.validate(version2Schema, lists) as boolean;
	}

	private convertVersion1ToVersion2(lists: VillagerListV1[]): VillagerList[] {
		return lists.map((list: VillagerListV1) => ({
			id: nanoid(),
			title: list.title,
			members: list.members.map((villagerId: string) =>
				VillagersRepository.getVillagerById(villagerId)
			)
		}));
	}
}
