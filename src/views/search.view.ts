import SearchComponents from '../components/search.components';
import Villager from '../models/villager.model';
import { getElement as $, loadImage, replaceChildren } from '../util/util';
import { Observable, Subject } from 'rxjs';

export default class SearchV {
    private searchResultsElement: HTMLDivElement;
    private searchBarElement: HTMLInputElement;
    private readonly searchUpdatedSubject = new Subject<string>();
    private readonly searchResultClickedSubject = new Subject<Villager>();

    constructor() {
        this.preloadImages();
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

    public get searchQueryUpdated$(): Observable<string> {
        return this.searchUpdatedSubject.asObservable();
    }

    public get searchResultClicked$(): Observable<Villager> {
        return this.searchResultClickedSubject.asObservable();
    }

    private preloadImages(): void {
        loadImage('/villager_icons/default.gif');
    }

    private bindEvents(): void {
        this.searchBarElement.oninput = () => {
            this.searchUpdated();
        };
        $('search_button').onclick = () => {
            this.searchUpdated();
        };
    }

    private resultClicked(villager: Villager): void {
        this.searchResultClickedSubject.next(villager);
    }

    // TODO: Throttling?
    private searchUpdated(): void {
        const query: string = this.searchBarElement.value;
        this.searchUpdatedSubject.next(query);
        this.styleBirthdayEasterEgg(query);
    }

    private styleBirthdayEasterEgg(query: string): void {
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
