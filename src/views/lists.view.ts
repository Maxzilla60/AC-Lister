import Controller from '../actions';
import ButtonBuilder from '../components/ButtonBuilder';
import DivisionBuilder from '../components/DivisionBuilder';
import IconBuilder from '../components/IconBuilder';
import ImageBuilder from '../components/ImageBuilder';
import InputFieldBuilder from '../components/InputFieldBuilder';
import ListElementBuilder from '../components/ListElementBuilder';
import ListItemBuilder from '../components/ListItemBuilder';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { aTextNode, clearElement, getElement as $, trimName } from '../util/util';
import ProfileView from './profile.view';

export default class ListsView {
    public static updateView(withListToRenameId?: string): void {
        clearElement($('lists'));

        if (stateService.listsAreEmpty()) {
            $('lists').appendChild(this.anEmptyListInfoElement());
        } else {
            this.appendLists(withListToRenameId);
        }

        this.updateListEditingButtons();

        if (withListToRenameId) { this.focusAndSelectRenameInput(); }
    }

    private static appendLists(withListToRenameId?: string): void {
        for (const list of stateService.getLists()) {
            const renameEnabled = withListToRenameId && list.id === withListToRenameId;
            this.appendListSection(list, renameEnabled);
        }
    }

    private static appendListSection(list: VillagerList, renameEnabled: boolean = false): void {
        $('lists').appendChild(
            new ListItemBuilder()
                // TODO: Update tests to use the data- attribute
                .withDataAttribute('id', list.id)
                .withChildren(
                    this.aListHeaderSection(list, renameEnabled),
                    this.aListMembersSection(list.id, list.members),
                )
                .withClassNames('list')
                .build()
        );
    }

    private static aListHeaderSection(list: VillagerList, renameEnabled: boolean = false): HTMLDivElement {
        let headerChildren: HTMLElement[];
        if (renameEnabled) {
            headerChildren = [
                this.aListTitleInputElement(list),
                this.aListRenameConfirmButton(list),
            ];
        } else {
            headerChildren = [
                this.aListTitleElement(list),
                this.aListDeleteButton(list),
                this.aListRenameButton(list),
            ];
        }
        return new DivisionBuilder()
            .withClassNames('list_header')
            .withChildren(...headerChildren)
            .build();
    }

    private static aListTitleElement(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { ProfileView.updateListSelect(list.id); })
            .withInnerHTML(list.title)
            .withClassNames('list_title')
            .isClickable()
            .build();
    }

    private static aListDeleteButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { Controller.deleteList(list.id); })
            .asFontAwesome('fa-trash')
            .withTitle('Delete list')
            .withClassNames('listdelete_button')
            .isClickable()
            .build();
    }

    private static aListRenameButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { Controller.renameList(list.id); })
            .asFontAwesome('fa-edit')
            .withTitle('Edit list title')
            .withClassNames('listrename_button')
            .isClickable()
            .build();
    }

    private static aListTitleInputElement(list: VillagerList): HTMLInputElement {
        return new InputFieldBuilder('text')
            .onChange(() => { Controller.applyTitle(list.id, this.getRenameListTitleValue()); })
            .withValue(list.title)
            .withMaxLength(30)
            .withId('rename_bar')
            .build();
    }

    private static aListRenameConfirmButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { Controller.applyTitle(list.id, this.getRenameListTitleValue()); })
            .asFontAwesome('fa-check')
            .withId('confirmrename_button')
            .withTitle('Edit name')
            .isClickable()
            .build();
    }

    private static aListMembersSection(listId: string, members: string[]) {
        return new ListElementBuilder()
            .withClassNames('list_members')
            .withChildren(
                ...members.map(villager => this.aMemberElement(villager, listId))
            )
            .build();
    }

    private static aMemberElement(villagerId: string, listId: string): HTMLLIElement {
        return new ListItemBuilder()
            .withTitle(villagerId)
            .withClassNames('list_member')
            .appendChild(
                this.aMemberButton(villagerId, listId)
            )
            .build();
    }

    private static aMemberButton(villagerId: string, listId: string): Node {
        return new ButtonBuilder(() => { Controller.loadProfile(villagerId, listId); })
            .withClassNames('member_button')
            .isClickable()
            .appendChild(this.aMemberImage(villagerId))
            .build();
    }

    private static aMemberImage(villagerId: string): Node {
        return new ImageBuilder(`./villager_icons/${villagerId}.gif`, './villager_icons/other/default.gif')
            .withTitle(trimName(villagerId))
            .build();
    }

    private static updateListEditingButtons(): void {
        const exportListsButton: HTMLButtonElement = $('exportlists_button') as HTMLButtonElement;
        exportListsButton.disabled = stateService.listsAreEmpty();
        exportListsButton.className = 'clickable fa fa-upload';

        const clearListsButton: HTMLButtonElement = $('clearlists_button') as HTMLButtonElement;
        clearListsButton.disabled = stateService.listsAreEmpty();
        clearListsButton.className = 'clickable fa fa-times';
    }

    private static anEmptyListInfoElement(): HTMLElement {
        return new DivisionBuilder()
            .withChildren(
                aTextNode('Click'),
                this.anAddNewListButton(),
                aTextNode('to make a new list!'),
            )
            .withId('emptylists_prompt')
            .build();
    }

    private static anAddNewListButton(): Node {
        return new IconBuilder('fa-plus')
            .onClick(Controller.newList)
            .withId('emptylists_newlist_button')
            .withTitle('Add list')
            .isClickable()
            .build();
    }

    private static getRenameListTitleValue(): string {
        return ($('rename_bar') as HTMLInputElement).value;
    }

    private static focusAndSelectRenameInput() {
        $('rename_bar').focus();
        ($('rename_bar') as HTMLInputElement).select();
    }
}
