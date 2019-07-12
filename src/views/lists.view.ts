import ListsComponents from '../components/lists.components';
import Villager from '../models/villager.model';
import VillagerList from '../models/villagerlist.model';
import { getChildElementByClassName, getElement as $, replaceChildren } from '../util/util';
import { Observable, Subject } from 'rxjs';

// TODO: Rename to "View"
export default class ListsV {
    private currentListsAreEmpty: boolean;
    private listsElement: HTMLElement;
    private fileInputElement: HTMLInputElement;
    private exportListsButton: HTMLButtonElement;
    private clearListsButton: HTMLButtonElement;
    private readonly newListClickedSubject = new Subject<void>();
    private readonly clearAllListsButtonClickedSubject = new Subject<void>();
    private readonly listTitleClickedSubject = new Subject<VillagerList>();
    private readonly deleteListButtonClickedSubject = new Subject<VillagerList>();
    private readonly applyTitleToListButtonClickedSubject = new Subject<{ listId: string, newTitle: string }>();
    private readonly listMemberButtonClickedSubject = new Subject<{ villagerId: string, listId: string }>();
    private readonly exportListsClickedSubject = new Subject<void>();
    private readonly importListsFileSelectedSubject = new Subject<File>();

    constructor() {
        this.listsElement = $('lists');
        this.fileInputElement = $('file_input') as HTMLInputElement;
        this.exportListsButton = $('exportlists_button') as HTMLButtonElement;
        this.clearListsButton = $('clearlists_button') as HTMLButtonElement;
        this.bindEvents();
    }

    public init(lists: VillagerList[]): void {
        this.currentListsAreEmpty = lists.length <= 0;
        if (this.currentListsAreEmpty) {
            this.viewNoLists();
        } else {
            this.appendLists(lists);
            this.updateListEditingButtons(false);
        }
    }

    public viewNoLists(): void {
        this.appendNoListsMessage();
        this.updateListEditingButtons(true);
        this.currentListsAreEmpty = true;
    }

    public displayNewList(newList: VillagerList): void {
        if (this.currentListsAreEmpty) {
            replaceChildren(this.listsElement, this.aListElement(newList));
        } else {
            this.listsElement.appendChild(this.aListElement(newList));
        }
        this.currentListsAreEmpty = false;
        this.renameListButtonClicked(newList);
    }

    public removeListFromView(listId: string): void {
        const listElementToRemove = $(listId);
        this.listsElement.removeChild(listElementToRemove);
        if (this.listsElement.children.length <= 0) {
            this.viewNoLists();
        }
    }

    public displayUpdatedList(list: VillagerList): void {
        this.displayTitleForList(list);
    }

    public updateMembersForList(listId: string, members: Villager[]): void {
        const listElementToRename = $(listId);
        const listMembersToReplace = getChildElementByClassName(listElementToRename, 'list_members');
        listElementToRename.replaceChild(this.aListMembersSection(listId, members), listMembersToReplace);
    }

    public get newListClicked$(): Observable<void> {
        return this.newListClickedSubject.asObservable();
    }

    public get clearAllListsButtonClicked$(): Observable<void> {
        return this.clearAllListsButtonClickedSubject.asObservable();
    }

    public get deleteListButtonClicked$(): Observable<VillagerList> {
        return this.deleteListButtonClickedSubject.asObservable();
    }

    public get applyTitleToListButtonClicked$(): Observable<{ listId: string, newTitle: string }> {
        return this.applyTitleToListButtonClickedSubject.asObservable();
    }

    public get listMemberButtonClicked$(): Observable<{ villagerId: string, listId: string }> {
        return this.listMemberButtonClickedSubject.asObservable();
    }

    public get exportListsClicked$(): Observable<void> {
        return this.exportListsClickedSubject.asObservable();
    }

    public get importListsFileSelected$(): Observable<File> {
        return this.importListsFileSelectedSubject.asObservable();
    }

    // Events:

    private newListClicked(): void {
        this.newListClickedSubject.next();
    }

    private clearAllListsButtonClicked(): void {
        if (confirm('Are you sure you want to clear all lists?')) {
            this.clearAllListsButtonClickedSubject.next();
        }
    }

    private listTitleClicked(list: VillagerList): void {
        this.listTitleClickedSubject.next(list);
    }

    private deleteListButtonClicked(list: VillagerList): void {
        if (confirm(`Are you sure you want to delete "${list.title}"?`)) {
            this.deleteListButtonClickedSubject.next(list);
        }
    }

    private renameListButtonClicked(list: VillagerList): void {
        this.displayRenamingForList(list);
        const listRenameTitleElement = this.getRenameBar(list.id);
        listRenameTitleElement.value = list.title;
        listRenameTitleElement.focus();
        listRenameTitleElement.select();
    }

    private applyTitleToListButtonClicked(listId: string): void {
        this.applyTitleToListButtonClickedSubject.next({ listId, newTitle: this.getRenameBar(listId).value });
    }

    private listMemberButtonClicked(villagerId: string, listId: string): void {
        this.listMemberButtonClickedSubject.next({ villagerId, listId });
    }

    private exportListsClicked(): void {
        this.exportListsClickedSubject.next();
    }

    private importListsClicked(): void {
        if (this.currentListsAreEmpty || confirm('Are you sure you want to override current lists?')) {
            this.fileInputElement.click();
        }
    }

    private importListsFileSelected(): void {
        const selectedFile = this.fileInputElement.files[0];
        this.importListsFileSelectedSubject.next(selectedFile);
        this.fileInputElement.value = '';
    }

    // Private methods:

    private bindEvents(): void {
        this.clearListsButton.onclick = () => {
            this.clearAllListsButtonClicked();
        };
        $('newlist_button').onclick = () => {
            this.newListClicked();
        };
        this.exportListsButton.onclick = () => {
            this.exportListsClicked();
        };
        $('importlists_button').onclick = () => {
            this.importListsClicked();
        };
        this.fileInputElement.onchange = () => {
            this.importListsFileSelected();
        };
    }

    private updateListEditingButtons(listsAreEmpty: boolean = true): void {
        this.exportListsButton.disabled = listsAreEmpty;
        this.exportListsButton.className = 'clickable fa fa-upload';

        this.clearListsButton.disabled = listsAreEmpty;
        this.clearListsButton.className = 'clickable fa fa-times';
    }

    private displayRenamingForList(list: VillagerList): void {
        this.displayTitleForList(list, true);
    }

    private displayTitleForList(list: VillagerList, renameEnabled: boolean = false): void {
        const listElementToRename = $(list.id);
        const listHeaderToReplace = getChildElementByClassName(listElementToRename, 'list_header');
        listElementToRename.replaceChild(this.aListHeaderElement(list, renameEnabled), listHeaderToReplace);
    }

    private appendNoListsMessage(): void {
        replaceChildren(this.listsElement, ListsComponents.aNoListInfoElement(() => { this.newListClicked(); }));
    }

    private appendLists(lists: VillagerList[]): void {
        const fragment = document.createDocumentFragment();

        for (const list of lists) {
            fragment.appendChild(this.aListElement(list));
        }

        replaceChildren(this.listsElement, fragment);
    }

    private getRenameBar(listId: string): HTMLInputElement {
        const listElement = $(listId);
        const listHeader = getChildElementByClassName(listElement, 'list_header');
        return getChildElementByClassName(listHeader, 'rename_bar') as HTMLInputElement;
    }

    // Components:

    private aListElement(list: VillagerList): Node {
        return ListsComponents.aListElement(
            list,
            () => { this.applyTitleToListButtonClicked(list.id); },
            () => { this.listTitleClicked(list); },
            () => { this.deleteListButtonClicked(list); },
            () => { this.renameListButtonClicked(list); },
            (villagerId: string) => { this.listMemberButtonClicked(villagerId, list.id); },
        );
    }

    private aListHeaderElement(list: VillagerList, renameEnabled: boolean): Node {
        return ListsComponents.aListHeaderElement(
            list,
            () => { this.applyTitleToListButtonClicked(list.id); },
            () => { this.listTitleClicked(list); },
            () => { this.deleteListButtonClicked(list); },
            () => { this.renameListButtonClicked(list); },
            renameEnabled,
        );
    }

    private aListMembersSection(listId: string, members: Villager[]): Node {
        return ListsComponents.aListMembersSection(
            members,
            (villagerId: string) => { this.listMemberButtonClicked(villagerId, listId); },
        );
    }
}
