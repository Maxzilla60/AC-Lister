import { VillagerList } from '../models/villagerlist.model';
import { getElement as $ } from '../util/util';
import { v4 as uuid } from 'uuid';

class StateService {
    private _currentListSelect: string = '';
    private _currentProfile: string = '';

    public get currentLoadedProfileId(): string {
        return this._currentProfile;
    }
    public set currentLoadedProfileId(newId: string) {
        this._currentProfile = newId;
    }

    public get currentListSelect(): string {
        return this._currentListSelect;
    }
    public set currentListSelect(newValue: string) {
        this._currentListSelect = newValue;
    }

    public getLists(): VillagerList[] {
        return this._lists;
    }

    public getListById(id: string): VillagerList {
        return this._lists.find(l => l.id === id);
    }

    public addNewList(): string {
        const newId = uuid();
        const tempLists = this._lists;
        tempLists.push({
            title: 'New List',
            id: newId,
            members: []
        });
        this._lists = tempLists;
        return newId;
    }

    public renameList(listId: string, newTitle: string): void {
        const tempLists = this._lists;
        tempLists
            .find(l => l.id === listId)
            .title = newTitle;
        this._lists = tempLists;
    }

    public deleteList(id: string): void {
        this._lists = this._lists.filter(l => l.id !== id);
    }

    public clearAllLists(): void {
        this._lists = [];
    }

    public addVillagerToList(villagerNameToAdd: string, listId: string): void {
        const tempLists = this._lists;
        const listToAddTo: VillagerList = tempLists.find(l => l.id === listId);
        listToAddTo.members.push(villagerNameToAdd);
        listToAddTo.members.sort();
        this._lists = tempLists;
    }

    public removeVillagerFromList(villagerNameToRemove: string, listId: string): void {
        const tempLists = this._lists;
        const listToRemoveFrom: VillagerList = tempLists.find(l => l.id === listId);
        listToRemoveFrom.members = listToRemoveFrom.members
            .filter(v => v !== villagerNameToRemove);
        this._lists = tempLists;
    }

    public listsAreEmpty(): boolean {
        return this._lists.length <= 0;
    }

    public villagerIsInList(villagerName: string, listId: string): boolean {
        return !this.listsAreEmpty() && this.getListById(listId).members.includes(villagerName);
    }

    public aProfileIsLoaded(): boolean {
        return this._currentProfile !== '';
    }

    public importListFromFile(selectedFile: File, callbackWhenDone: Function): void {
        const reader = new FileReader();

        reader.onload = () => {
            this._lists = JSON.parse(reader.result as string); // Save lists
            ($('file_input') as HTMLInputElement).value = ''; // Reset input

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

export const stateService = new StateService();
