import { applyTitle, deleteList, loadProfile, newList, renameList } from '../actions';
import ButtonBuilder from '../components/ButtonBuilder';
import DivisionBuilder from '../components/DivisionBuilder';
import ImageBuilder from '../components/ImageBuilder';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { clearElement, getElement as $, trimName } from '../util/util';
import ProfileView from './profile.view';

export default class ListsView {
    public static updateView(withListToRenameId?: string): void {
        let listContentElement: HTMLElement = document.createElement('div');

        if (stateService.listsAreEmpty()) {
            listContentElement = this.anEmptyListInfoElement();
        } else {
            this.appendLists(listContentElement, withListToRenameId);
        }

        clearElement($('lists'));
        $('lists').appendChild(listContentElement);
        if (stateService.listsAreEmpty()) {
            $('emptylists_newlist_button').onclick = newList;
        }
        this.updateListEditingButtons();

        if (withListToRenameId) { this.focusAndSelectRenameInput(); }
    }

    private static appendLists(listContentElement: HTMLElement, withListToRenameId?: string): void {
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
        const exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('exportlists_button');
        const clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clearlists_button');
        exportListsButton.disabled = stateService.listsAreEmpty();
        clearListsButton.disabled = stateService.listsAreEmpty();
        exportListsButton.className = stateService.listsAreEmpty() ? 'disabled fa fa-upload' : 'clickable fa fa-upload';
        clearListsButton.className = stateService.listsAreEmpty() ? 'disabled fa fa-times' : 'clickable fa fa-times';
    }

    private static aListTitleElement(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { ProfileView.updateListSelect(list.id); })
            .withInnerHTML(list.title)
            .withClassNames('clickable', 'list')
            .build();
    }

    private static aListDeleteButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { deleteList(list.id); })
            .asFontAwesome('fa-trash')
            .withTitle('Delete list')
            .withClassNames('clickable')
            .build();
    }

    private static aListRenameButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { renameList(list.id); })
            .asFontAwesome('fa-pencil')
            .withTitle('Edit list title')
            .withClassNames('clickable')
            .build();
    }

    private static aVillagerListIconsSection(list: VillagerList): HTMLElement {
        return new DivisionBuilder()
            .withChildren(...list.members.map(villager => this.aVillagerListIcon(villager, list.id)))
            .withPaddingTop(0)
            .withPaddingBottom(0)
            .build();
    }

    private static aVillagerListIcon(villager: string, listId: string): HTMLImageElement {
        return new ImageBuilder(`./villager_icons/${villager}.gif`)
            .withTitle(trimName(villager))
            .onClick(() => { loadProfile(villager, listId); })
            .build();
    }

    private static anEmptyListInfoElement(): HTMLElement {
        return new DivisionBuilder()
            // .withInnerHTML('Click<i onclick="index.newList();" title="Add list" class="clickable fa fa-plus" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!')
            .withInnerHTML('Click<i id="emptylists_newlist_button" title="Add list" class="clickable fa fa-plus" style="color: orange;" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!')
            .withPaddingLeft(15)
            .withColor('orange')
            .build();
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
        return new ButtonBuilder(() => { applyTitle(list.id, this.getRenameListTitleValue()); })
            .asFontAwesome('fa-check')
            .withTitle('Edit name')
            .withClassNames('clickable')
            .build();
    }

    private static getRenameListTitleValue(): string {
        return (<HTMLInputElement>$('rename_bar')).value;
    }

    private static focusAndSelectRenameInput() {
        $('rename_bar').focus();
        (<HTMLInputElement>$('rename_bar')).select();
    }
}
