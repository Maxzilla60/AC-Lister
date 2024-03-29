import Villager from '../../shared/models/villager.model';
import { getElement as $, loadImage, replaceChildren } from '../../shared/util';
import SearchComponents from '../components/search.components';
import Hammer from 'hammerjs';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, map, pluck, tap } from 'rxjs/operators';

export default class SearchView {
	public searchQueryUpdated$: Observable<string>;
	private readonly searchResultClickedSubject = new Subject<Villager>();
	private _searchPanelIsOpen = false;

	private readonly searchPanelElement: HTMLElement;
	private readonly searchResultsElement: HTMLDivElement;
	private readonly searchBarElement: HTMLInputElement;
	private hammer: HammerManager;

	public constructor() {
		this.preloadImages();
		this.searchPanelElement = $('search-container');
		this.searchResultsElement = $('search-results') as HTMLDivElement;
		this.searchBarElement = $('search-bar') as HTMLInputElement;
		this.setupSwipeGesture();
		this.bindEvents();
	}

	private setupSwipeGesture(): void {
		this.hammer = new Hammer.Manager(document);
		this.hammer.add(new Hammer.Pan({
			direction: Hammer.DIRECTION_RIGHT,
			threshold: 200,
		}));
		this.hammer.on('panright', () => {
			if (!this.searchPanelIsOpen) {
				this.openSearchPanel();
			}
		});
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
		void loadImage('/villager_icons/default.gif');
	}

	private get searchPanelIsOpen(): boolean { return this._searchPanelIsOpen; }

	private set searchPanelIsOpen(newValue: boolean) {
		this._searchPanelIsOpen = newValue;
		this.searchPanelElement.className = this._searchPanelIsOpen ? 'open' : '';
	}

	private bindEvents(): void {
		this.searchQueryUpdated$ = merge(
			fromEvent(this.searchBarElement, 'input')
				.pipe(pluck('target', 'value')),
			fromEvent($('search-button'), 'click')
				.pipe(map(() => this.searchBarElement.value)),
		).pipe(
			map((query: string) => query.toLowerCase()),
			tap((query: string) => { this.styleBirthdayEasterEgg(query); }),
			auditTime(500),
			distinctUntilChanged(),
		);
		$('close-search-panel-button').addEventListener('click', () => {
			this.closeSearchPanel();
		});
		this.bindClickOutside();
	}

	private bindClickOutside(): void {
		document.addEventListener('click', (event: Event) => {
			const target = event.target as Element;
			if (this.targetIsOutsideSearchPanel(target)) {
				this.closeSearchPanel();
			}
		});
	}

	private targetIsOutsideSearchPanel(target: Element): boolean {
		return this.searchPanelIsOpen &&
			target.id !== 'open-search-panel-button' &&
			!this.searchPanelElement.contains(target);
	}

	private resultClicked(villager: Villager): void {
		this.searchResultClickedSubject.next(villager);
		this.closeSearchPanel();
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
