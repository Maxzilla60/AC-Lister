import { loadProfile } from '../actions';
import ButtonBuilder from '../components/ButtonBuilder';
import DivisionBuilder from '../components/DivisionBuilder';
import ImageBuilder from '../components/ImageBuilder';
import { Villager } from '../models/villager.model';
import { clearElement, getElement as $ } from '../util/util';
import villagers from '../util/villagers.json';

export default class SearchView {
    public static updateView(resultList: Villager[] = villagers): void {
        const searchResultsElement = $('search_results');
        clearElement(searchResultsElement);

        if (resultList.length <= 0) {
            searchResultsElement.appendChild(
                this.aNoResultsElement()
            );
        } else {
            for (const villager of resultList) {
                searchResultsElement.appendChild(this.aVillagerSearchResultButton(villager));
            }
        }

        this.fadeTransition();
    }

    private static aVillagerSearchResultButton(villager: Villager): HTMLButtonElement {
        return new ButtonBuilder(() => { loadProfile(villager.id); })
            .withClassNames('clickable', 'result')
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
        return new ImageBuilder(`./villager_icons/${villager.id}.gif`)
            .withAlt(villager.name)
            .withFloatLeft()
            .build();
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
