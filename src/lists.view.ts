import { applyTitle, deleteList, lists, loadProfile, renameList } from './main';
import { VillagerList } from './models/villagerlist.model';
import ProfileView from './profile.view';
import { clearElement, listsAreEmpty, trimName } from './util';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

export default class ListsView {
    public static updateView(): void {
        var listContentElement: HTMLElement = document.createElement('div');
        if (!listsAreEmpty()) {
            for (let list of lists) {
                this.appendListSection(listContentElement, list);
            }
        }
        else {
            listContentElement = this.anEmptyListInfoElement();
        }
        clearElement($('lists'));
        $('lists').appendChild(listContentElement);
        this.updateListEditingButtons();
    }

    public static updateViewWithListTitleRenaming(listToRenameId: number): void {
        var listContentElement: HTMLElement = document.createElement('div');
        if (!listsAreEmpty()) {
            for (let list of lists) {
                if (list.id == listToRenameId) {
                    this.appendListWithRenameInputSection(listContentElement, list);
                }
                else {
                    this.appendListSection(listContentElement, list);
                }
            }
        }
        else {
            listContentElement = this.anEmptyListInfoElement();;
        }
        clearElement($('lists'));
        $('lists').appendChild(listContentElement);
        this.updateListEditingButtons();
        this.focusAndSelectRenameInput();
    }

    private static appendListSection(listContentElement: HTMLElement, list: VillagerList): void {
        listContentElement.appendChild(this.aListTitleElement(list));
        listContentElement.appendChild(this.aListDeleteButton(list));
        listContentElement.appendChild(this.aListRenameButton(list));
        listContentElement.appendChild(this.aVillagerListIconsSection(list));
    }

    private static appendListWithRenameInputSection(listContentElement: HTMLElement, list: VillagerList): void {
        listContentElement.appendChild(this.aListTitleInputElement(list));
        listContentElement.appendChild(this.aListRenameConfirmButton(list));
        listContentElement.appendChild(this.aVillagerListIconsSection(list));
    }

    private static updateListEditingButtons(): void {
        var exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('export_lists');
        var clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clear_lists');
        if (!listsAreEmpty()) {
            exportListsButton.className = 'clickable fa fa-download';
            exportListsButton.disabled = false;
            clearListsButton.className = 'clickable fa fa-times';
            clearListsButton.disabled = false;
        } else {
            exportListsButton.className = 'disabled fa fa-download';
            exportListsButton.disabled = true;
            clearListsButton.className = 'disabled fa fa-times';
            clearListsButton.disabled = true;
        }
    }

    private static aListTitleElement(list: VillagerList): HTMLButtonElement {
        let listTitleElement: HTMLButtonElement = document.createElement('button');
        listTitleElement.onclick = () => { ProfileView.updateListSelect(list.id); };
        listTitleElement.innerHTML = list.title;
        listTitleElement.className = 'clickable list';
        return listTitleElement;
    }

    private static aListDeleteButton(list: VillagerList): HTMLButtonElement {
        let deleteButtonElement: HTMLButtonElement = document.createElement('button');
        deleteButtonElement.onclick = () => { deleteList(list.id); }
        deleteButtonElement.title = 'Delete list';
        deleteButtonElement.className = 'clickable fa fa-trash';
        deleteButtonElement.setAttribute('aria-hidden', 'true');
        return deleteButtonElement;
    }

    private static aListRenameButton(list: VillagerList): HTMLButtonElement {
        let listRenameButtonElement: HTMLButtonElement = document.createElement('button');
        listRenameButtonElement.onclick = () => { renameList(list.id); }
        listRenameButtonElement.title = 'Edit list title';
        listRenameButtonElement.className = 'clickable fa fa-pencil';
        listRenameButtonElement.setAttribute('aria-hidden', 'true');
        return listRenameButtonElement;
    }

    private static aVillagerListIconsSection(list: VillagerList): HTMLElement {
        let villagerIconsSection = this.aDividerElement();
        for (let villager of list.members) {
            villagerIconsSection.appendChild(this.aVillagerListIcon(villager, list.id));
        }
        return villagerIconsSection;
    }

    private static aVillagerListIcon(villager: string, listId: number): HTMLImageElement {
        let villagerListIcon: HTMLImageElement = document.createElement('img');
        villagerListIcon.onclick = () => { loadProfile(villager); };
        villagerListIcon.title = trimName(villager);
        villagerListIcon.src = `./villager_icons/${villager}.gif`;
        return villagerListIcon;
    }

    private static anEmptyListInfoElement(): HTMLElement {
        let emptyListInfoElement = document.createElement('div');
        emptyListInfoElement.style.paddingLeft = '15px';
        emptyListInfoElement.style.color = 'orange';
        emptyListInfoElement.innerHTML = 'Click<i onclick="index.newList();" title="Add list" class="clickable fa fa-plus" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!';
        return emptyListInfoElement;
    }

    private static aDividerElement(): HTMLElement {
        var divider: HTMLElement = document.createElement('div');
        divider.style.paddingBottom = '0';
        divider.style.paddingTop = '0';
        return divider;
    }

    private static aListTitleInputElement(list: VillagerList): HTMLInputElement {
        let listTitleInputElement: HTMLInputElement = document.createElement('input');
        listTitleInputElement.onchange = () => {
            applyTitle(list.id, this.getRenameListTitleValue());
        }
        listTitleInputElement.id = 'rename_bar';
        listTitleInputElement.type = 'text';
        listTitleInputElement.value = list.title;
        listTitleInputElement.maxLength = 30;
        return listTitleInputElement;
    }

    private static aListRenameConfirmButton(list: VillagerList): HTMLButtonElement {
        let listRenameButtonElement: HTMLButtonElement = document.createElement('button');
        listRenameButtonElement.onclick = () => {
            applyTitle(list.id, this.getRenameListTitleValue());
        }
        listRenameButtonElement.title = 'Edit name';
        listRenameButtonElement.className = 'clickable fa fa-check';
        listRenameButtonElement.setAttribute('aria-hidden', 'true');
        return listRenameButtonElement;
    }

    private static getRenameListTitleValue(): string {
        return (<HTMLInputElement>$('rename_bar')).value;
    }

    private static focusAndSelectRenameInput() {
        $('rename_bar').focus();
        (<HTMLInputElement>$('rename_bar')).select();
    }
}