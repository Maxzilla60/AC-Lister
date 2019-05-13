import { applyTitle, deleteList, loadProfile, renameList } from '../main';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { clearElement, trimName } from '../util/util';
import ProfileView from './profile.view';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

export default class ListsView {
    public static updateView(withListToRenameId?: number): void {
        let listContentElement: HTMLElement = document.createElement('div');

        if (!stateService.listsAreEmpty()) {
            this.appendLists(listContentElement, withListToRenameId);
        } else {
            listContentElement = this.anEmptyListInfoElement();
        }

        clearElement($('lists'));
        $('lists').appendChild(listContentElement);
        this.updateListEditingButtons();

        if (withListToRenameId) { this.focusAndSelectRenameInput(); }
    }

    private static appendLists(listContentElement: HTMLElement, withListToRenameId?: number): void {
        for (const list of stateService.getLists()) {
            if (withListToRenameId && list.id === withListToRenameId) {
                this.appendListWithRenameInputSection(listContentElement, list);
            } else {
                this.appendListSection(listContentElement, list);
            }
        }
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
        const exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('export_lists');
        const clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clear_lists');
        exportListsButton.disabled = stateService.listsAreEmpty();
        clearListsButton.disabled = stateService.listsAreEmpty();
        exportListsButton.className = stateService.listsAreEmpty() ? 'disabled fa fa-upload' : 'clickable fa fa-upload';
        clearListsButton.className = stateService.listsAreEmpty() ? 'disabled fa fa-times' : 'clickable fa fa-times';
    }

    private static aListTitleElement(list: VillagerList): HTMLButtonElement {
        const listTitleElement: HTMLButtonElement = document.createElement('button');
        listTitleElement.onclick = () => { ProfileView.updateListSelect(list.id); };
        listTitleElement.innerHTML = list.title;
        listTitleElement.className = 'clickable list';
        return listTitleElement;
    }

    private static aListDeleteButton(list: VillagerList): HTMLButtonElement {
        const deleteButtonElement: HTMLButtonElement = document.createElement('button');
        deleteButtonElement.onclick = () => { deleteList(list.id); };
        deleteButtonElement.title = 'Delete list';
        deleteButtonElement.className = 'clickable fa fa-trash';
        deleteButtonElement.setAttribute('aria-hidden', 'true');
        return deleteButtonElement;
    }

    private static aListRenameButton(list: VillagerList): HTMLButtonElement {
        const listRenameButtonElement: HTMLButtonElement = document.createElement('button');
        listRenameButtonElement.onclick = () => { renameList(list.id); };
        listRenameButtonElement.title = 'Edit list title';
        listRenameButtonElement.className = 'clickable fa fa-pencil';
        listRenameButtonElement.setAttribute('aria-hidden', 'true');
        return listRenameButtonElement;
    }

    private static aVillagerListIconsSection(list: VillagerList): HTMLElement {
        const villagerIconsSection = this.aDividerElement();
        for (const villager of list.members) {
            villagerIconsSection.appendChild(this.aVillagerListIcon(villager, list.id));
        }
        return villagerIconsSection;
    }

    private static aVillagerListIcon(villager: string, listId: number): HTMLImageElement {
        const villagerListIcon: HTMLImageElement = document.createElement('img');
        villagerListIcon.onclick = () => { loadProfile(villager, listId); };
        villagerListIcon.title = trimName(villager);
        villagerListIcon.src = `./villager_icons/${villager}.gif`;
        return villagerListIcon;
    }

    private static anEmptyListInfoElement(): HTMLElement {
        const emptyListInfoElement = document.createElement('div');
        emptyListInfoElement.style.paddingLeft = '15px';
        emptyListInfoElement.style.color = 'orange';
        emptyListInfoElement.innerHTML = 'Click<i onclick="index.newList();" title="Add list" class="clickable fa fa-plus" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!';
        return emptyListInfoElement;
    }

    private static aDividerElement(): HTMLElement {
        const divider: HTMLElement = document.createElement('div');
        divider.style.paddingBottom = '0';
        divider.style.paddingTop = '0';
        return divider;
    }

    private static aListTitleInputElement(list: VillagerList): HTMLInputElement {
        const listTitleInputElement: HTMLInputElement = document.createElement('input');
        listTitleInputElement.onchange = () => {
            applyTitle(list.id, this.getRenameListTitleValue());
        };
        listTitleInputElement.id = 'rename_bar';
        listTitleInputElement.type = 'text';
        listTitleInputElement.value = list.title;
        listTitleInputElement.maxLength = 30;
        return listTitleInputElement;
    }

    private static aListRenameConfirmButton(list: VillagerList): HTMLButtonElement {
        const listRenameButtonElement: HTMLButtonElement = document.createElement('button');
        listRenameButtonElement.onclick = () => {
            applyTitle(list.id, this.getRenameListTitleValue());
        };
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
