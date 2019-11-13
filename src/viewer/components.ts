import DivisionBuilder from '../builders/DivisionBuilder';
import ImageBuilder from '../builders/ImageBuilder';
import ListElementBuilder from '../builders/ListElementBuilder';
import ListItemBuilder from '../builders/ListItemBuilder';
import Villager from '../models/villager.model';
import VillagerList from '../models/villagerlist.model';
import { aTextNode } from '../util';

export default class ViewerComponents {
	public static aListElement(list: VillagerList): HTMLLIElement {
		return new ListItemBuilder()
			.withId(list.id)
			.withChildren(
				this.aListHeaderElement(list),
				this.aListMembersSection(list.members),
			)
			.withClassNames('list')
			.build();
	}

	public static aListHeaderElement(list: VillagerList): HTMLDivElement {
		return new DivisionBuilder()
			.withClassNames('list_header')
			.withChildren(this.aListTitleElement(list))
			.build();
	}

	public static aNoListInfoElement(): HTMLElement {
		return new DivisionBuilder()
			.withChildren(aTextNode('There are no lists here...'))
			.withId('emptylists_prompt')
			.build();
	}

	public static aListMembersSection(members: Villager[]): HTMLUListElement {
		return new ListElementBuilder()
			.withClassNames('list_members viewer')
			.withChildren(...members.map(villager => this.aMemberElement(villager)))
			.build();
	}

	private static aListTitleElement(list: VillagerList): HTMLDivElement {
		return new DivisionBuilder()
			.withInnerHTML(list.title)
			.withClassNames('list_title')
			.build();
	}

	private static aMemberElement(villager: Villager): HTMLLIElement {
		return new ListItemBuilder()
			.withTitle(villager.name)
			.withClassNames('list_member')
			.appendChild(this.aMemberImage(villager))
			.build();
	}

	private static aMemberImage(villager: Villager): Node {
		return new ImageBuilder(`/villager_icons/${villager.getIconImage()}`, '/villager_icons/default.gif')
			.withTitle(villager.name)
			.build();
	}
}
