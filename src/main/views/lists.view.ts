import Villager from '../../shared/models/villager.model';
import VillagerList from '../../shared/models/villagerlist.model';
import { getChildElementByClassName, getElement as $, mapToVoid, replaceChildren } from '../../shared/util';
import ListsComponents from '../components/lists.components';
import { ListElementEvents } from './../components/lists.components';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface LoadProfilePayload { villagerId: string; listId: string; }

export default class ListsView {
    public newListClicked$: Observable<void>;
    public exportListsClicked$: Observable<void>;
    public importListsFileSelected$: Observable<File>;
    public clearAllListsButtonClicked$: Observable<void>;
    public openSearchPanelClicked$: Observable<void>;
    private readonly deleteListButtonClickedSubject = new Subject<VillagerList>();
    private readonly applyTitleToListButtonClickedSubject = new Subject<{ listId: string, newTitle: string }>();
    private readonly listTitleClickedSubject = new Subject<VillagerList>();
    private readonly listMemberButtonClickedSubject = new Subject<LoadProfilePayload>();

    private currentListsAreEmpty: boolean;
    private listsElement: HTMLElement;

    private fileInputElement: HTMLInputElement;
    private exportListsButton: HTMLButtonElement;
    private clearListsButton: HTMLButtonElement;
    private newListButton: HTMLButtonElement;

    constructor() {
        this.listsElement = $('lists');
        this.fileInputElement = $('file_input') as HTMLInputElement;
        this.newListButton = $('newlist_button') as HTMLButtonElement;
        this.exportListsButton = $('exportlists_button') as HTMLButtonElement;
        this.clearListsButton = $('clearlists_button') as HTMLButtonElement;
        this.bindEvents();
    }

    public init(lists: VillagerList[]): void {
        this.updateLists(lists);
    }

    public updateLists(lists: VillagerList[]): void {
        this.currentListsAreEmpty = lists.length <= 0;
        if (this.currentListsAreEmpty) {
            this.viewNoLists();
        } else {
            this.appendLists(lists);
            this.updateListEditingButtons();
        }
    }

    public viewNoLists(): void {
        this.currentListsAreEmpty = true;
        this.appendNoListsMessage();
        this.updateListEditingButtons();
    }

    public displayNewList(newList: VillagerList): void {
        if (this.currentListsAreEmpty) {
            replaceChildren(this.listsElement, this.aListElement(newList));
        } else {
            this.listsElement.appendChild(this.aListElement(newList));
        }
        this.currentListsAreEmpty = false;
        this.renameListButtonClicked(newList);
        this.updateListEditingButtons();
    }

    public removeListFromView(listId: string): void {
        const listElementToRemove = $(listId);
        this.listsElement.removeChild(listElementToRemove);
        if (this.listsElement.children.length <= 0) {
            this.viewNoLists();
        }
    }

    public updateList(list: VillagerList): void {
        this.displayTitleForList(list);
    }

    public updateMembersForList(listId: string, members: Villager[]): void {
        const listElementToRename = $(listId);
        const listMembersToReplace = getChildElementByClassName(listElementToRename, 'list_members');
        listElementToRename.replaceChild(this.aListMembersSection(listId, members), listMembersToReplace);
    }

    public get deleteListButtonClicked$(): Observable<VillagerList> {
        return this.deleteListButtonClickedSubject.asObservable();
    }

    public get applyTitleToListButtonClicked$(): Observable<{ listId: string, newTitle: string }> {
        return this.applyTitleToListButtonClickedSubject.asObservable();
    }

    public get listTitleClicked$(): Observable<VillagerList> {
        return this.listTitleClickedSubject.asObservable();
    }

    public get listMemberButtonClicked$(): Observable<LoadProfilePayload> {
        return this.listMemberButtonClickedSubject.asObservable();
    }

    // #region Events

    private deleteListButtonClicked(list: VillagerList): void {
        if (confirm(`Are you sure you want to delete "${list.title}"?`)) {
            this.deleteListButtonClickedSubject.next(list);
        }
    }

    private renameListButtonClicked(list: VillagerList): void {
        this.displayRenamingTitleForList(list);
    }

    private applyTitleToListButtonClicked(listId: string): void {
        this.applyTitleToListButtonClickedSubject.next({ listId, newTitle: this.getRenameBar(listId).value });
    }

    private listTitleClicked(list: VillagerList): void {
        this.listTitleClickedSubject.next(list);
    }

    private listMemberButtonClicked(villagerId: string, listId: string): void {
        this.listMemberButtonClickedSubject.next({ villagerId, listId });
    }

    private bindEvents(): void {
        this.newListClicked$ = fromEvent(this.newListButton, 'click').pipe(
            mapToVoid(),
        );
        this.exportListsClicked$ = fromEvent(this.exportListsButton, 'click').pipe(
            mapToVoid(),
        );
        this.importListsFileSelected$ = fromEvent(this.fileInputElement, 'change').pipe(
            map((event: Event) => this.getFileFromInputElement(event.target as HTMLInputElement)),
        );
        this.clearAllListsButtonClicked$ = fromEvent(this.clearListsButton, 'click').pipe(
            filter(() => confirm('Are you sure you want to clear all lists?')),
            mapToVoid(),
        );
        this.openSearchPanelClicked$ = fromEvent($('open_searchpanel_button') as HTMLButtonElement, 'click').pipe(
            mapToVoid(),
        );
        $('importlists_button').addEventListener('click', () => {
            this.openImportListPrompt();
        });
    }

    private getFileFromInputElement(inputElement: HTMLInputElement): File {
        return inputElement.files[0];
    }

    // #endregion

    // #region DOM Manipulation

    private updateListEditingButtons(): void {
        this.exportListsButton.disabled = this.currentListsAreEmpty;
        this.exportListsButton.className = 'clickable fa fa-upload';

        this.clearListsButton.disabled = this.currentListsAreEmpty;
        this.clearListsButton.className = 'clickable fa fa-times';
    }

    private displayRenamingTitleForList(list: VillagerList): void {
        this.displayTitleForList(list, true);
        const listRenameTitleElement = this.getRenameBar(list.id);
        listRenameTitleElement.value = list.title;
        listRenameTitleElement.focus();
        listRenameTitleElement.select();
    }

    private displayTitleForList(list: VillagerList, renameEnabled: boolean = false): void {
        const listElementToRename = $(list.id);
        const listHeaderToReplace = getChildElementByClassName(listElementToRename, 'list_header');
        listElementToRename.replaceChild(this.aListHeaderElement(list, renameEnabled), listHeaderToReplace);
    }

    private appendNoListsMessage(): void {
        replaceChildren(this.listsElement, this.aNoListInfoElement());
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

    private openImportListPrompt(): void {
        if (this.currentListsAreEmpty || confirm('Are you sure you want to override current lists?')) {
            this.fileInputElement.click();
        }
    }
    // #endregion

    // #region Components

    private aListElement(list: VillagerList): Node {
        return ListsComponents.aListElement(list, this.createListElementEventsFromList(list));
    }

    private aListHeaderElement(list: VillagerList, renameEnabled: boolean): Node {
        return ListsComponents.aListHeaderElement(list, this.createListElementEventsFromList(list), renameEnabled);
    }

    private aListMembersSection(listId: string, members: Villager[]): Node {
        return ListsComponents.aListMembersSection(members, (villagerId: string) => { this.listMemberButtonClicked(villagerId, listId); });
    }

    private createListElementEventsFromList(list: VillagerList): ListElementEvents {
        return {
            applyTitleEvent: () => { this.applyTitleToListButtonClicked(list.id); },
            listTitleClickedEvent: () => { this.listTitleClicked(list); },
            deleteListEvent: () => { this.deleteListButtonClicked(list); },
            renameListEvent: () => { this.renameListButtonClicked(list); },
            memberClickedEvent: (villagerId: string) => { this.listMemberButtonClicked(villagerId, list.id); },
        };
    }

    private aNoListInfoElement(): Node {
        return ListsComponents.aNoListInfoElement(() => { this.newListButton.click(); });
    }
    // #endregion
}
