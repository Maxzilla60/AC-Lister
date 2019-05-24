import { loadProfile } from '../actions';
import { Villager } from '../models/villager.model';
import { aBreakElement, clearElement, getElement as $ } from '../util/util';
import villagers from '../util/villagers.json';

export default class SearchView {
    public static updateView(resultList: Villager[] = villagers): void {
        const searchResultsElement = $('search_results');
        clearElement(searchResultsElement);

        for (const villager of resultList) {
            searchResultsElement.appendChild(this.aVillagerSearchResultButton(villager));
            searchResultsElement.appendChild(aBreakElement());
        }

        this.fadeTransition();
    }

    private static aVillagerSearchResultButton(villager: Villager): HTMLButtonElement {
        const villagersSearchResultButton: HTMLButtonElement = document.createElement('button');
        villagersSearchResultButton.onclick = () => { loadProfile(villager.id); };
        villagersSearchResultButton.className = 'result';
        villagersSearchResultButton.appendChild(this.aVillagersSearchResultImage(villager));
        villagersSearchResultButton.appendChild(this.aVillagersSearchResultNameElement(villager.name));
        return villagersSearchResultButton;
    }

    private static aVillagersSearchResultNameElement(villagerName: string): HTMLElement {
        const villagersSearchResultNameElement: HTMLElement = document.createElement('div');
        villagersSearchResultNameElement.innerHTML = villagerName;
        return villagersSearchResultNameElement;
    }

    private static aVillagersSearchResultImage(villager: Villager): HTMLImageElement {
        const villagersSearchResultImage: HTMLImageElement = document.createElement('img');
        villagersSearchResultImage.alt = villager.name;
        villagersSearchResultImage.style.cssFloat = 'left';
        villagersSearchResultImage.src = `./villager_icons/${villager.id}.gif`;
        return villagersSearchResultImage;
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
