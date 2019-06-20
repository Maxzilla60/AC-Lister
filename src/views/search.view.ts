import ButtonBuilder from '../components/ButtonBuilder';
import DivisionBuilder from '../components/DivisionBuilder';
import ImageBuilder from '../components/ImageBuilder';
import Controller from '../controller';
import { Villager } from '../models/villager.model';
import { clearElement, getElement as $ } from '../util/util';
import villagers from '../util/villagers.json';

export default class SearchView {
    public static updateView(resultList: Villager[] = villagers): void {
        const searchResultsElement = $('search_results');
        clearElement(searchResultsElement);

        if (resultList.length <= 0) {
            this.appendNoResultsElement(searchResultsElement);
        } else {
            this.appendResults(resultList, searchResultsElement);
        }
    }

    private static appendResults(resultList: Villager[], searchResultsElement: HTMLElement) {
        for (const villager of resultList) {
            searchResultsElement.appendChild(this.aVillagerSearchResultButton(villager));
        }
    }

    private static appendNoResultsElement(searchResultsElement: HTMLElement) {
        searchResultsElement.appendChild(this.aNoResultsElement());
    }

    private static aVillagerSearchResultButton(villager: Villager): HTMLButtonElement {
        return new ButtonBuilder(() => { Controller.loadProfile(villager.id); })
            .withClassNames('result')
            .isClickable()
            .withChildren(
                this.aVillagersSearchResultImage(villager),
                this.aVillagersSearchResultNameElement(villager.name),
            )
            .build();
    }

    private static aVillagersSearchResultNameElement(villagerName: string): HTMLElement {
        return new DivisionBuilder()
            .withInnerHTML(villagerName)
            .build();
    }

    private static aVillagersSearchResultImage(villager: Villager): HTMLImageElement {
        return new ImageBuilder(`./villager_icons/${this.getIconImage(villager.id)}`, './villager_icons/default.gif')
            .withAlt(villager.name)
            .withFloatLeft()
            .build();
    }

    private static getIconImage(villagerId: string): string {
        const villager: Villager = Controller.getVillagerById(villagerId);
        return villager.hasIconImage ? `${villager.id}.gif` : 'default.gif';
    }

    private static aNoResultsElement(): HTMLDivElement {
        return new DivisionBuilder()
            .withInnerHTML('No results found')
            .withId('no_results')
            .build();
    }

    private static fadeTransition(): void {
        /* // Transition:
        // Hide:
        document.querySelectorAll<HTMLElement>('.result')
            .forEach(result => result.style.opacity = '0');
        // Show:
        setTimeout(function () {
            document.querySelectorAll<HTMLElement>('.result')
                .forEach(result => result.style.opacity = '1');
        }, 100); */
    }
}
