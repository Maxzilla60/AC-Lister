import ButtonBuilder from '../builders/ButtonBuilder';
import { HTMLEvent } from '../builders/HTMLEvent.type';
import ListItemBuilder from '../builders/ListItemBuilder';
import SpanBuilder from '../builders/SpanBuilder';
import Villager from '../models/villager.model';
import VillagerList from '../models/villagerlist.model';
import { aSpanElement } from '../util';
import confetti from 'canvas-confetti';

export default class ProfileComponents {
	public static aProfileElement(profile: Villager): DocumentFragment {
		const fragment = document.createDocumentFragment();
		fragment.appendChild(ProfileComponents.aProfileInfoListItem('fa-tag', 'Name', profile.name));
		fragment.appendChild(ProfileComponents.aProfileInfoListItem('fa-user', 'Species', profile.species));
		fragment.appendChild(ProfileComponents.aProfileInfoListItem('fa-heart', 'Personality', profile.personality));
		fragment.appendChild(ProfileComponents.aProfileInfoListItem('fa-coffee', 'Favourite coffee', profile.coffee));
		fragment.appendChild(profile.birthdayIsToday()
			? ProfileComponents.aBirthdayEasterEggInfoListItem(profile, () => { this.birthdayHurray(); })
			: ProfileComponents.aProfileInfoListItem('fa-birthday-cake', 'Birthday', profile.birthday));
		fragment.appendChild(ProfileComponents.aWikiIconButton(profile.wiki));
		fragment.appendChild(ProfileComponents.aStoreIconButton(profile.store));
		return fragment;
	}

	public static aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
		const dropdownOption: HTMLOptionElement = document.createElement('option');
		dropdownOption.innerHTML = list.title;
		dropdownOption.value = list.id.toString();
		dropdownOption.selected = isSelected;
		return dropdownOption;
	}

	private static aProfileInfoListItem(iconName: string, iconTitle: string, infoValue: string): HTMLLIElement {
		return new ListItemBuilder()
			.asFontAwesome(iconName, iconTitle)
			.appendChild(this.aProfileInfoValueSpanElement(infoValue))
			.build();
	}

	private static aBirthdayEasterEggInfoListItem(villager: Villager, easterEggEvent: HTMLEvent): HTMLLIElement {
		return new ListItemBuilder()
			.withChildren(this.aBirthdayEasterEggButton(villager.name, easterEggEvent), this.aBirthdayEasterEggTextNode(villager.birthday))
			.build();
	}

	private static aWikiIconButton(wikiLink: string): HTMLButtonElement {
		return new ButtonBuilder(() => {
			window.open(wikiLink, '_blank');
		})
			.asFontAwesome('fa-wikipedia-w', true)
			.withTitle('Open Wiki page')
			.isClickable()
			.build();
	}

	private static aStoreIconButton(storeLink: string): HTMLButtonElement {
		return new ButtonBuilder(() => {
			window.open(storeLink, '_blank');
		})
			.asFontAwesome('fa-shopping-bag')
			.withTitle('Buy this art!')
			.isClickable()
			.build();
	}

	private static aProfileInfoValueSpanElement(text: string): HTMLSpanElement {
		return text === '' ? this.anNASpanElement() : aSpanElement(text);
	}

	private static anNASpanElement(): HTMLSpanElement {
		return new SpanBuilder('N/A').withClassNames('na').build();
	}

	private static aBirthdayEasterEggButton(villagerName: string, easterEggEvent: HTMLEvent): HTMLButtonElement {
		return new ButtonBuilder(easterEggEvent)
			.asFontAwesome('fa-birthday-cake')
			.withId('birthday_button')
			.withTitle(`Happy birthday to ${villagerName}!`)
			.isClickable()
			.build();
	}

	private static aBirthdayEasterEggTextNode(birthday: string): Text | HTMLSpanElement {
		return new SpanBuilder(birthday).withClassNames('birthday').build();
	}

	private static birthdayHurray(): void {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#FFC0CB'],
		});
		new Audio('./happybirthday.mp3').play();
	}
}
