import { VillagerList } from '../models/villagerlist.model';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

class StateService {
    /* private static instance: StateService;
    private constructor() { }
    public static getInstance(): StateService {
        if (!this.instance) {
            this.instance = new StateService();
        }
        return this.instance;
    } */

    private _currentListSelect: number = -1;
    private _currentProfile: string = '';

    public getLists(): VillagerList[] {
        return this._lists;
    }

    public aProfileIsLoaded(): boolean {
        return this._currentProfile !== '';
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

    public addNewList(): number {
        this._idCount++;
        const tempLists = this._lists;
        tempLists.push({
            title: 'New List',
            id: this._idCount,
            members: []
        });
        this._lists = tempLists;
        return this._idCount;
    }

    public deleteList(id: number): void {
        // tslint:disable-next-line: triple-equals
        this._lists = this._lists.filter(l => l.id != id);
    }

    public renameList(listId: number, newTitle: string): void {
        const tempLists = this._lists;
        tempLists
            // tslint:disable-next-line: triple-equals
            .find(l => l.id == listId)
            .title = newTitle;
        this._lists = tempLists;
    }

    public clearAllLists(): void {
        this._idCount = -1;
        this._lists = [];
    }

    public addVillagerToList(villagerNameToAdd: string, listId: number): void {
        const tempLists = this._lists;
        // tslint:disable-next-line: triple-equals
        const listToAddTo: VillagerList = tempLists.find(l => l.id == listId);
        listToAddTo.members.push(villagerNameToAdd);
        listToAddTo.members.sort();
        this._lists = tempLists;
    }

    public removeVillagerFromList(villagerNameToRemove: string, listId: number): void {
        const tempLists = this._lists;
        // tslint:disable-next-line: triple-equals
        const listToRemoveFrom: VillagerList = tempLists.find(l => l.id == listId);
        listToRemoveFrom.members = listToRemoveFrom.members
            .filter(v => v !== villagerNameToRemove);
        this._lists = tempLists;
    }

    public listsAreEmpty(): boolean {
        return this._lists.length <= 0;
    }

    public villagerIsInList(villagerName: string, listId: number): boolean {
        return !this.listsAreEmpty() && this.getListById(listId).members.includes(villagerName);
    }

    private set _idCount(newValue: number) {
        localStorage.idCount = newValue;
    }
    private get _idCount(): number {
        if (!localStorage.idCount) {
            this._idCount = -1;
        }
        return localStorage.idCount;
    }

    public getListById(id: number): VillagerList {
        // tslint:disable-next-line: triple-equals
        return this._lists.find(l => l.id == id);
    }

    public get currentLoadedProfileId(): string {
        return this._currentProfile;
    }

    public set currentLoadedProfileId(newId: string) {
        this._currentProfile = newId;
    }

    public get currentListSelect(): number {
        return this._currentListSelect;
    }
    public set currentListSelect(newValue: number) {
        this._currentListSelect = newValue;
    }

    public importListFromFile(selectedFile: File, callbackWhenDone: Function): void {
        const reader = new FileReader();

        reader.onload = () => {
            this._lists = JSON.parse(reader.result as string); // Save lists
            this.findIDCount(); // Get idCount
            (<HTMLInputElement>$('file-input')).value = ''; // Reset input

            callbackWhenDone();
        };

        reader.readAsText(selectedFile);
    }

    private findIDCount(): void {
        let temp = -1;

        for (const list of this._lists) {
            if (list.id > temp) {
                temp = list.id;
            }
        }

        this._idCount = temp;
    }
}

export const stateService = new StateService();
