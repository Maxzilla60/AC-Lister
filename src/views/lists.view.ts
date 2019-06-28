import ListsComponents from '../components/lists.components';
import VillagerList from '../models/villagerlist.model';
import { clearElement, getChildElementByClassName, getElement as $ } from '../util/util';
import IListsController from './interfaces/listscontroller.interface';

export default class ListsV {
    private controller: IListsController;
    private currentListsAreEmpty: boolean;
    private listsElement: HTMLElement;
    private fileInputElement: HTMLInputElement;
    private exportListsButton: HTMLButtonElement;
    private clearListsButton: HTMLButtonElement;

    constructor(controller: IListsController) {
        this.controller = controller;
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
            this.clearAndAppendToListsElement(this.aListElement(newList));
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

    public updateMembersForList(listId: string, members: string[]): void {
        const listElementToRename = $(listId);
        const listMembersToReplace = getChildElementByClassName(listElementToRename, 'list_members');
        listElementToRename.replaceChild(this.aListMembersSection(listId, members), listMembersToReplace);
    }

    // Events:

    private newListClicked(): void {
        this.controller.newList();
    }

    private clearAllListsButtonClicked(): void {
        if (confirm('Are you sure you want to clear all lists?')) {
            this.controller.clearLists();
        }
    }

    private listTitleClicked(list: VillagerList): void {
        this.controller.selectList(list.id);
    }

    private deleteListButtonClicked(list: VillagerList): void {
        if (confirm(`Are you sure you want to delete "${list.title}"?`)) {
            this.controller.deleteList(list.id);
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
        this.controller.renameList(listId, this.getRenameBar(listId).value);
    }

    private listMemberButtonClicked(villagerId: string, listId: string): void {
        this.controller.loadProfile(villagerId);
        this.controller.selectList(listId);
    }

    private exportListsClicked(): void {
        this.controller.exportLists();
    }

    private importListsClicked(): void {
        if (this.currentListsAreEmpty || confirm('Are you sure you want to override current lists?')) {
            this.fileInputElement.click();
        }
    }

    private importListsFileSelected(): void {
        const selectedFile = this.fileInputElement.files[0];
        this.controller.importLists(selectedFile);
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
        this.fileInputElement.addEventListener('change', () => {
            this.importListsFileSelected();
        });
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
        this.clearAndAppendToListsElement(ListsComponents.aNoListInfoElement(() => { this.newListClicked(); }));
    }

    private appendLists(lists: VillagerList[]): void {
        const fragment = document.createDocumentFragment();

        for (const list of lists) {
            fragment.appendChild(this.aListElement(list));
        }

        this.clearAndAppendToListsElement(fragment);
    }

    private clearAndAppendToListsElement(node: Node): void {
        clearElement(this.listsElement);
        this.listsElement.appendChild(node);
    }

    private getRenameBar(listId: string): HTMLInputElement {
        const listElement = $(listId);
        const listHeader = getChildElementByClassName(listElement, 'list_header');
        return getChildElementByClassName(listHeader, 'rename_bar') as HTMLInputElement;
    }

    private getMembersElement(listId: string): HTMLUListElement {
        const listElement = $(listId);
        return getChildElementByClassName(listElement, 'list_members') as HTMLUListElement;
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

    private aListMembersSection(listId: string, members: string[]): Node {
        return ListsComponents.aListMembersSection(
            listId,
            members,
            (villagerId: string) => { this.listMemberButtonClicked(villagerId, listId); },
        );
    }
}
