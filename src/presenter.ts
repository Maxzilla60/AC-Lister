import Villager from './models/villager.model';
import VillagerList from './models/villagerlist.model';
import VillagersRepository from './repository/villagers.repository';
import AppStateService from './state/state.service';
import ListsView, { LoadProfilePayload } from './views/lists.view';
import ProfileView from './views/profile.view';
import SearchView from './views/search.view';
import { saveAs } from 'file-saver';
import lozad from 'lozad';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export default class Presenter {
	private state: AppStateService;
	private searchView: SearchView;
	private profileView: ProfileView;
	private listsView: ListsView;
	private lozadObserver: lozad.Observer;

	constructor() {
		this.lozadObserver = lozad();
		this.state = new AppStateService();
		this.searchView = new SearchView();
		this.subscribeToSearchView();
		this.profileView = new ProfileView();
		this.subscribeToProfileView();
		this.listsView = new ListsView();
		this.subscribeToListsView();
		this.subscribeToLoadProfile();
	}

	public init(): void {
		this.listsView.init(this.state.getLists());
		this.profileView.init(this.state.getLists());
		this.searchView.init(VillagersRepository.getAllVillagers());
		this.observeLazyLoadedImages();
	}

	private updateSearch(query: string): void {
		let results: Villager[];
		if (query === 'birthday') {
			results = VillagersRepository.findVillagersWhosBirthdayIsToday();
		} else {
			results = VillagersRepository.searchFor(query);
		}
		this.searchView.updateSearchResults(results);
		this.observeLazyLoadedImages();
	}

	private loadProfile(villagerId: string, listId?: string): void {
		const villager = VillagersRepository.getVillagerById(villagerId);
		this.profileView.updateProfile(villager, listId);
	}

	private newList(): void {
		const newList: VillagerList = this.state.addNewList();
		this.listsView.displayNewList(newList);
		this.profileView.updateLists(this.state.getLists());
	}

	private clearLists(): void {
		this.state.clearAllLists();
		this.listsView.viewNoLists();
		this.profileView.updateLists(this.state.getLists());
	}

	private deleteList(listId: string): void {
		this.state.deleteList(listId);
		this.listsView.removeListFromView(listId);
		this.profileView.updateLists(this.state.getLists());
	}

	private renameList(listId: string, newTitle: string): void {
		const renamedList = this.state.renameList(listId, newTitle);
		this.listsView.updateList(renamedList);
		this.profileView.updateLists(this.state.getLists());
	}

	private addVillagerToList(villagerIdToAdd: string, listId: string): void {
		const villagerToAdd: Villager = VillagersRepository.getVillagerById(villagerIdToAdd);
		this.state.addVillagerToList(villagerToAdd, listId);
		this.updateListMembersToViews(listId);
	}

	private removeVillagerFromList(villagerIdToRemove: string, listId: string): void {
		this.state.removeVillagerFromList(villagerIdToRemove, listId);
		this.updateListMembersToViews(listId);
	}

	private updateListMembersToViews(listId: string): void {
		this.listsView.updateMembersForList(listId, this.state.getListById(listId).members);
		this.profileView.updateLists(this.state.getLists());
		this.observeLazyLoadedImages();
	}

	private selectList(listId: string): void {
		this.profileView.selectList(listId);
	}

	private exportLists(): void {
		const blob = new Blob([JSON.stringify(this.state.getLists(), null, 2)], { type: 'text/plain' });
		saveAs(blob, 'ACLists.json');
	}

	private openSearchPanel(): void {
		this.searchView.openSearchPanel();
	}

	private importLists(listsFile: File): void {
		const reader = new FileReader();

		reader.onload = () => {
			const lists = JSON.parse(reader.result as string);
			this.state.overrideLists(lists);
			this.listsView.updateLists(this.state.getLists());
			this.profileView.updateLists(this.state.getLists());
			this.observeLazyLoadedImages();
		};

		reader.readAsText(listsFile);
	}

	private subscribeToSearchView(): void {
		this.searchView.searchQueryUpdated$.subscribe((query: string) => {
			this.updateSearch(query);
		});
	}

	private subscribeToProfileView(): void {
		this.profileView.addVillagerClicked$.subscribe((payload: { villagerIdToAdd: string, listId: string }) => {
			this.addVillagerToList(payload.villagerIdToAdd, payload.listId);
		});
		this.profileView.removeVillagerClicked$.subscribe((payload: { villagerIdToAdd: string, listId: string }) => {
			this.removeVillagerFromList(payload.villagerIdToAdd, payload.listId);
		});
	}

	private subscribeToListsView(): void {
		this.listsView.newListClicked$.subscribe(() => {
			this.newList();
		});
		this.listsView.exportListsClicked$.subscribe(() => {
			this.exportLists();
		});
		this.listsView.importListsFileSelected$.subscribe((file: File) => {
			this.importLists(file);
		});
		this.listsView.clearAllListsButtonClicked$.subscribe(() => {
			this.clearLists();
		});
		this.listsView.deleteListButtonClicked$.subscribe((list: VillagerList) => {
			this.deleteList(list.id);
		});
		this.listsView.applyTitleToListButtonClicked$.subscribe((payload: { listId: string, newTitle: string }) => {
			this.renameList(payload.listId, payload.newTitle);
		});
		this.listsView.listTitleClicked$.subscribe((list: VillagerList) => {
			this.selectList(list.id);
		});
		this.listsView.openSearchPanelClicked$.subscribe(() => {
			this.openSearchPanel();
		});
	}

	private subscribeToLoadProfile(): void {
		const mappedSearchResultClicked$: Observable<LoadProfilePayload> = this.searchView.searchResultClicked$
			.pipe(map((villager: Villager) => {
				return ({ villagerId: villager.id, listId: null });
			}));
		const distinctPayloads = distinctUntilChanged((x: LoadProfilePayload, y: LoadProfilePayload) => {
			return x.villagerId === y.villagerId && x.listId === y.listId;
		});

		merge(mappedSearchResultClicked$, this.listsView.listMemberButtonClicked$)
			.pipe(distinctPayloads)
			.subscribe((payload: LoadProfilePayload) => {
				this.loadProfile(payload.villagerId, payload.listId);
			});
	}

	private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
