import VillagerList from '../models/villagerlist.model';
import { v4 as uuid } from 'uuid';

export default class AppStateService {
    private _currentProfile: string = '';

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
            id: uuid(),
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

    public addVillagerToList(villagerIdToAdd: string, listId: string): void {
        if (this.villagerIsInList(villagerIdToAdd, listId)) {
            return;
        }
        const tempLists = this._lists;
        const listToAddTo: VillagerList = tempLists.find(l => l.id === listId);
        listToAddTo.members.push(villagerIdToAdd);
        listToAddTo.members.sort();
        this._lists = tempLists;
    }

    public removeVillagerFromList(villagerIdToRemove: string, listId: string): void {
        const tempLists = this._lists;
        const listToRemoveFrom: VillagerList = tempLists.find(l => l.id === listId);
        listToRemoveFrom.members = listToRemoveFrom.members
            .filter(v => v !== villagerIdToRemove);
        this._lists = tempLists;
    }

    public listsAreEmpty(): boolean {
        return this._lists.length <= 0;
    }

    public villagerIsInList(villagerId: string, listId: string): boolean {
        return !this.listsAreEmpty() && this.getListById(listId).members.includes(villagerId);
    }

    public aProfileIsLoaded(): boolean {
        return this._currentProfile !== '';
    }

    public importListFromFile(selectedFile: Blob, callbackWhenDone: Function): void {
        const reader = new FileReader();

        reader.onload = () => {
            this._lists = JSON.parse(reader.result as string);
            callbackWhenDone();
        };

        reader.readAsText(selectedFile);
    }

    private get _lists(): VillagerList[] {
        if (!localStorage.lists) {
            localStorage.lists = '[]';
        }
        return JSON.parse(localStorage.lists);
    }

    private set _lists(newLists: VillagerList[]) {
        localStorage.lists = JSON.stringify(newLists);
    }
}
