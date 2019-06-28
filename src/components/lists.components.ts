import ButtonBuilder from '../builders/ButtonBuilder';
import DivisionBuilder from '../builders/DivisionBuilder';
import { HTMLEvent } from '../builders/HTMLEvent.type';
import IconBuilder from '../builders/IconBuilder';
import ImageBuilder from '../builders/ImageBuilder';
import InputFieldBuilder from '../builders/InputFieldBuilder';
import ListElementBuilder from '../builders/ListElementBuilder';
import ListItemBuilder from '../builders/ListItemBuilder';
import VillagerList from '../models/villagerlist.model';
import { aTextNode } from '../util/util';
import VillagersRepository from '../util/villagers.repository';

export default class ListsComponents {
    public static aListElement(
        list: VillagerList,
        applyTitleEvent: HTMLEvent,
        listTitleClickedEvent: HTMLEvent,
        deleteListEvent: HTMLEvent,
        renameListEvent: HTMLEvent,
        memberClickedEvent: (villagerId: string) => void,
    ): HTMLLIElement {
        return new ListItemBuilder()
            .withId(list.id)
            .withChildren(
                this.aListHeaderElement(list, applyTitleEvent, listTitleClickedEvent, deleteListEvent, renameListEvent),
                this.aListMembersSection(list.id, list.members, memberClickedEvent))
            .withClassNames('list')
            .build();
    }

    public static aListHeaderElement(
        list: VillagerList,
        applyTitleEvent: HTMLEvent,
        listTitleClickedEvent: HTMLEvent,
        deleteListEvent: HTMLEvent,
        renameListEvent: HTMLEvent,
        renameEnabled: boolean = false,
    ): HTMLDivElement {
        let headerChildren: HTMLElement[];
        if (renameEnabled) {
            headerChildren = [
                this.aListTitleInputElement(list, applyTitleEvent),
                this.aListRenameConfirmButton(applyTitleEvent)]
                ;
        } else {
            headerChildren = [
                this.aListTitleElement(list, listTitleClickedEvent),
                this.aListDeleteButton(list, deleteListEvent),
                this.aListRenameButton(list, renameListEvent)
            ];
        }
        return new DivisionBuilder()
            .withClassNames('list_header')
            .withChildren(...headerChildren)
            .build();
    }

    public static aNoListInfoElement(newListEvent: HTMLEvent): HTMLElement {
        return new DivisionBuilder()
            .withChildren(aTextNode('Click'), this.anAddNewListButton(newListEvent), aTextNode('to make a new list!'))
            .withId('emptylists_prompt')
            .build();
    }

    public static aListMembersSection(listId: string, members: string[], memberClickedEvent: (villagerId: string) => void): HTMLUListElement {
        return new ListElementBuilder()
            .withClassNames('list_members')
            .withChildren(...members.map(villager => this.aMemberElement(villager, listId, memberClickedEvent)))
            .build();
    }

    private static aListTitleElement(list: VillagerList, listTitleClickedEvent: HTMLEvent): HTMLButtonElement {
        return new ButtonBuilder(listTitleClickedEvent)
            .withInnerHTML(list.title)
            .withClassNames('list_title')
            .isClickable()
            .build();
    }

    private static aListDeleteButton(list: VillagerList, deleteListEvent: HTMLEvent): HTMLButtonElement {
        return new ButtonBuilder(deleteListEvent)
            .asFontAwesome('fa-trash')
            .withTitle('Delete list')
            .withClassNames('listdelete_button')
            .isClickable()
            .build();
    }

    private static aListRenameButton(list: VillagerList, renameListEvent: HTMLEvent): HTMLButtonElement {
        return new ButtonBuilder(renameListEvent)
            .asFontAwesome('fa-edit')
            .withTitle('Edit list title')
            .withClassNames('listrename_button')
            .isClickable()
            .build();
    }

    private static aListTitleInputElement(list: VillagerList, applyTitleEvent: HTMLEvent): HTMLInputElement {
        return new InputFieldBuilder('text')
            .onChange(applyTitleEvent)
            .withValue(list.title)
            .withMaxLength(30)
            .withClassNames('rename_bar')
            .build();
    }

    private static aListRenameConfirmButton(applyTitleEvent: HTMLEvent): HTMLButtonElement {
        return new ButtonBuilder(applyTitleEvent)
            .asFontAwesome('fa-check')
            .withId('confirmrename_button')
            .withTitle('Edit name')
            .isClickable()
            .build();
    }

    private static aMemberElement(villagerId: string, listId: string, memberClickedEvent: (villagerId: string) => void): HTMLLIElement {
        return new ListItemBuilder()
            .withTitle(villagerId)
            .withClassNames('list_member')
            .appendChild(this.aMemberButton(villagerId, memberClickedEvent))
            .build();
    }

    private static aMemberButton(villagerId: string, memberClickedEvent: (villagerId: string) => void): Node {
        return new ButtonBuilder(() => {
            memberClickedEvent(villagerId);
        })
            .withClassNames('member_button')
            .isClickable()
            .appendChild(this.aMemberImage(villagerId))
            .build();
    }

    private static aMemberImage(villagerId: string): Node {
        const villager = new VillagersRepository().getVillagerById(villagerId); // TODO: Dangit
        return new ImageBuilder(`./villager_icons/${villager.getIconImage()}`, './villager_icons/default.gif')
            .withTitle(villager.name)
            .build();
    }

    private static anAddNewListButton(newListEvent: HTMLEvent): Node {
        // TODO: cloneNode() the existing button
        return new IconBuilder('fa-plus')
            .onClick(newListEvent)
            .withId('emptylists_newlist_button')
            .withTitle('Add list')
            .isClickable()
            .build();
    }
}
