import ButtonBuilder from '../../shared/builders/ButtonBuilder';
import DivisionBuilder from '../../shared/builders/DivisionBuilder';
import { HTMLEvent } from '../../shared/builders/HTMLEvent.type';
import ImageBuilder from '../../shared/builders/ImageBuilder';
import InputFieldBuilder from '../../shared/builders/InputFieldBuilder';
import ListElementBuilder from '../../shared/builders/ListElementBuilder';
import ListItemBuilder from '../../shared/builders/ListItemBuilder';
import Villager from '../../shared/models/villager.model';
import VillagerList from '../../shared/models/villagerlist.model';
import { aTextNode, getElement as $ } from '../../shared/util';

export default class ListsComponents {
	public static aListElement(list: VillagerList, events: ListElementEvents): HTMLLIElement {
		return new ListItemBuilder()
			.withId(list.id)
			.withChildren(
				this.aListHeaderElement(list, events),
				this.aListMembersSection(list.members, events.memberClickedEvent))
			.withClassNames('list')
			.build();
	}

	public static aListHeaderElement(list: VillagerList, events: ListElementEvents, renameEnabled = false): HTMLDivElement {
		let headerChildren: HTMLElement[];
		if (renameEnabled) {
			headerChildren = [
				this.aListTitleInputElement(list, events.applyTitleEvent),
				this.aListRenameConfirmButton(events.applyTitleEvent),
			];
		} else {
			headerChildren = [
				this.aListTitleElement(list, events.listTitleClickedEvent),
				this.aListDeleteButton(events.deleteListEvent),
				this.aListRenameButton(events.renameListEvent),
			];
		}

		return new DivisionBuilder()
			.withClassNames('list-header')
			.withChildren(...headerChildren)
			.build();
	}

	public static aNoListInfoElement(newListEvent: HTMLEvent): HTMLElement {
		return new DivisionBuilder()
			.withChildren(aTextNode('Click'), this.anAddNewListButton(newListEvent), aTextNode('to make a new list!'))
			.withId('empty-lists-prompt')
			.build();
	}

	public static aListMembersSection(members: Villager[], memberClickedEvent: (villagerId: string) => void): HTMLUListElement {
		return new ListElementBuilder()
			.withClassNames('list-members')
			.withChildren(...members.map(villager => this.aMemberElement(villager, memberClickedEvent)))
			.build();
	}

	private static aListTitleElement(list: VillagerList, listTitleClickedEvent: HTMLEvent): HTMLButtonElement {
		return new ButtonBuilder(listTitleClickedEvent)
			.withInnerHTML(list.title)
			.withClassNames('list-title')
			.isClickable()
			.build();
	}

	private static aListDeleteButton(deleteListEvent: HTMLEvent): HTMLButtonElement {
		return new ButtonBuilder(deleteListEvent)
			.asFontAwesome('fa-trash')
			.withTitle('Delete list')
			.withClassNames('list-delete-button')
			.isClickable()
			.build();
	}

	private static aListRenameButton(renameListEvent: HTMLEvent): HTMLButtonElement {
		return new ButtonBuilder(renameListEvent)
			.asFontAwesome('fa-edit')
			.withTitle('Edit list title')
			.withClassNames('list-rename-button')
			.isClickable()
			.build();
	}

	private static aListTitleInputElement(list: VillagerList, applyTitleEvent: HTMLEvent): HTMLInputElement {
		return new InputFieldBuilder('text')
			.onChange(applyTitleEvent)
			.withValue(list.title)
			.withMaxLength(30)
			.withClassNames('rename-bar')
			.build();
	}

	private static aListRenameConfirmButton(applyTitleEvent: HTMLEvent): HTMLButtonElement {
		return new ButtonBuilder(applyTitleEvent)
			.asFontAwesome('fa-check')
			.withId('confirm-rename-button')
			.withTitle('Edit name')
			.isClickable()
			.build();
	}

	private static aMemberElement(villager: Villager, memberClickedEvent: (villagerId: string) => void): HTMLLIElement {
		return new ListItemBuilder()
			.withTitle(villager.name)
			.withClassNames('list-member')
			.appendChild(this.aMemberButton(villager, memberClickedEvent))
			.build();
	}

	private static aMemberButton(villager: Villager, memberClickedEvent: (villagerId: string) => void): Node {
		return new ButtonBuilder(() => {
			memberClickedEvent(villager.id);
		})
			.withClassNames('member-button')
			.isClickable()
			.appendChild(this.aMemberImage(villager))
			.build();
	}

	private static aMemberImage(villager: Villager): Node {
		return new ImageBuilder(`/villager_icons/${villager.getIconImage()}`, '/villager_icons/default.gif')
			.withAlt(`List member: ${villager.name}`)
			.withTitle(villager.name)
			.build();
	}

	private static anAddNewListButton(newListEvent: HTMLEvent): Node {
		const newListButton = $('new-list-button').cloneNode() as HTMLButtonElement;
		newListButton.addEventListener('click', newListEvent);
		return newListButton;
	}
}

export interface ListElementEvents {
	applyTitleEvent: HTMLEvent;
	listTitleClickedEvent: HTMLEvent;
	deleteListEvent: HTMLEvent;
	renameListEvent: HTMLEvent;
	memberClickedEvent: (villagerId: string) => void;
}
