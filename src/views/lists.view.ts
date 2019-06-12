import { applyTitle, deleteList, loadProfile, newList, renameList } from '../actions';
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
            .withClassNames('clickable', 'list_title')
            .build();
    }

    private static aListDeleteButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { deleteList(list.id); })
            .asFontAwesome('fa-trash')
            .withTitle('Delete list')
            .withClassNames('listdelete_button', 'clickable')
            .build();
    }

    private static aListRenameButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { renameList(list.id); })
            .asFontAwesome('fa-edit')
            .withTitle('Edit list title')
            .withClassNames('listrename_button', 'clickable')
            .build();
    }

    private static aListTitleInputElement(list: VillagerList): HTMLInputElement {
        return new InputFieldBuilder('text')
            .onChange(() => { applyTitle(list.id, this.getRenameListTitleValue()); })
            .withValue(list.title)
            .withMaxLength(30)
            .withId('rename_bar')
            .build();
    }

    private static aListRenameConfirmButton(list: VillagerList): HTMLButtonElement {
        return new ButtonBuilder(() => { applyTitle(list.id, this.getRenameListTitleValue()); })
            .asFontAwesome('fa-check')
            .withId('confirmrename_button')
            .withTitle('Edit name')
            .withClassNames('clickable')
            .build();
    }

    private static aListMembersSection(listId: string, members: string[]) {
        return new ListElementBuilder()
            .withClassNames('list_members')
            .withChildren(
                ...members.map(member => this.aMemberElement(member, listId))
            )
            .build();
    }

    private static aMemberElement(member: string, listId: string): HTMLLIElement {
        return new ListItemBuilder()
            .withTitle(member)
            .appendChild(
                this.aMemberButton(member, listId)
            )
            .build();
    }

    private static aMemberButton(member: string, listId: string): Node {
        return new ButtonBuilder(() => { loadProfile(member, listId); })
            .withClassNames('clickable', 'list_member')
            .appendChild(this.aMemberImage(member))
            .build();
    }

    private static aMemberImage(member: string): Node {
        return new ImageBuilder(`./villager_icons/${member}.gif`)
            .withTitle(trimName(member))
            .build();
    }

    private static updateListEditingButtons(): void {
        const exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('exportlists_button');
        exportListsButton.disabled = stateService.listsAreEmpty();
        exportListsButton.className = 'clickable fa fa-upload';

        const clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clearlists_button');
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
            .onClick(newList)
            .withId('emptylists_newlist_button')
            .withTitle('Add list')
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
