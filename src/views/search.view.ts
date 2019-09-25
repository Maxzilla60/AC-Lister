import SearchComponents from '../components/search.components';
import Villager from '../models/villager.model';
import { getElement as $, loadImage, replaceChildren } from '../util';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, map, pluck, tap } from 'rxjs/operators';

export default class SearchView {
	public searchQueryUpdated$: Observable<string>;
	private readonly searchResultClickedSubject = new Subject<Villager>();
	private _searchPanelIsOpen = false;

	private searchPanelElement: HTMLElement;
	private searchResultsElement: HTMLDivElement;
	private searchBarElement: HTMLInputElement;

	constructor() {
		this.preloadImages();
		this.searchPanelElement = $('search_container') as HTMLElement;
		this.searchResultsElement = $('search_results') as HTMLDivElement;
		this.searchBarElement = $('search_bar') as HTMLInputElement;
		this.bindEvents();
	}

	public init(allResults: Villager[]): void {
		this.updateSearchResults(allResults);
	}

	public updateSearchResults(results: Villager[]): void {
		if (results.length <= 0) {
			this.appendNoResultsElement();
		} else {
			this.appendResults(results);
		}
	}

	public openSearchPanel(): void {
		this.searchPanelIsOpen = true;
		setTimeout(() => {
			this.searchBarElement.focus();
			this.searchBarElement.select();
		}, 350);
	}
	public closeSearchPanel(): void {
		this.searchPanelIsOpen = false;
	}

	public get searchResultClicked$(): Observable<Villager> {
		return this.searchResultClickedSubject.asObservable();
	}

	private preloadImages(): void {
		loadImage('/villager_icons/default.gif');
	}

	private set searchPanelIsOpen(newValue: boolean) {
		this._searchPanelIsOpen = newValue;
		this.searchPanelElement.className = this._searchPanelIsOpen ? 'open' : '';
	}

	private bindEvents(): void {
		this.searchQueryUpdated$ = merge(
			fromEvent(this.searchBarElement, 'input')
				.pipe(pluck('target', 'value')),
			fromEvent($('search_button'), 'click')
				.pipe(map(() => this.searchBarElement.value)),
		).pipe(
			map((query: string) => query.toLowerCase()),
			tap((query: string) => { this.styleBirthdayEasterEgg(query); }),
			auditTime(500),
			distinctUntilChanged(),
		);
		$('close_searchpanel_button').addEventListener('click', () => {
			this.closeSearchPanel();
		});
	}

	private resultClicked(villager: Villager): void {
		this.searchResultClickedSubject.next(villager);
	}

	private styleBirthdayEasterEgg(query: string): void {
		if (query === 'birthday') {
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
				SearchComponents.aVillagerSearchResultButton(villager, () => { this.resultClicked(villager); }),
			);
		}
		replaceChildren(this.searchResultsElement, fragment);
	}
}
