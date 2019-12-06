import ButtonBuilder from '../../shared/builders/ButtonBuilder';
import DivisionBuilder from '../../shared/builders/DivisionBuilder';
import { HTMLEvent } from '../../shared/builders/HTMLEvent.type';
import ImageBuilder from '../../shared/builders/ImageBuilder';
import Villager from '../../shared/models/villager.model';

export default class SearchComponents {
	public static aVillagerSearchResultButton(villager: Villager, resultClickedEvent: HTMLEvent): HTMLButtonElement {
		return new ButtonBuilder(resultClickedEvent)
			.withClassNames('result')
			.isClickable()
			.withChildren(this.aVillagersSearchResultImage(villager), this.aVillagersSearchResultNameElement(villager.name))
			.build();
	}

	public static aNoResultsElement(): HTMLDivElement {
		return new DivisionBuilder()
			.withInnerHTML('No results found')
			.withId('no_results')
			.build();
	}

	private static aVillagersSearchResultImage(villager: Villager): HTMLImageElement {
		return new ImageBuilder(`/villager_icons/${villager.getIconImage()}`, '/villager_icons/default.gif')
			.withAlt(villager.name)
			.build();
	}
	private static aVillagersSearchResultNameElement(villagerName: string): HTMLElement {
		return new DivisionBuilder().withInnerHTML(villagerName).build();
	}
}
