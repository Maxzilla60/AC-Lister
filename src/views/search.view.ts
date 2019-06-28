import SearchComponents from '../components/search.components';
import Villager from '../models/villager.model';
import { getElement as $, replaceChildren } from '../util/util';
import ISearchController from './interfaces/searchcontroller.interface';

export default class SearchV {
    private controller: ISearchController;
    private searchResultsElement: HTMLDivElement;
    private searchBarElement: HTMLInputElement;

    constructor(controller: ISearchController) {
        this.controller = controller;
        this.searchResultsElement = $('search_results') as HTMLDivElement;
        this.searchBarElement = $('search_bar') as HTMLInputElement;
        this.bindEvents();
    }

    public init(allResults: Villager[]): void {
        this.updateResults(allResults);
    }

    public updateResults(results: Villager[]): void {
        if (results.length <= 0) {
            this.appendNoResultsElement();
        } else {
            this.appendResults(results);
        }
    }

    private bindEvents(): void {
        this.searchBarElement.oninput = () => {
            this.searchUpdated();
        };
        $('search_button').onclick = () => {
            this.searchUpdated();
        };
    }

    // TODO: Use Subject & Observable?
    private resultClicked(villager: Villager): void {
        this.controller.loadProfile(villager.id);
    }

    private searchUpdated(): void {
        const query = this.searchBarElement.value;
        this.controller.updateSearch(query);

        if (query.toLowerCase() === 'birthday') {
            this.searchBarElement.className = 'birthday';
        } else {
            this.searchBarElement.className = '';
        }
    }

    private appendNoResultsElement(): void {
        replaceChildren(this.searchResultsElement, SearchComponents.aNoResultsElement());
    }

    private appendResults(resultList: Villager[]): void {
        const fragment = document.createDocumentFragment();
        for (const villager of resultList) {
            fragment.appendChild(
                SearchComponents.aVillagerSearchResultButton(villager, () => {
                    this.resultClicked(villager);
                }),
            );
        }
        replaceChildren(this.searchResultsElement, fragment);
    }
}
