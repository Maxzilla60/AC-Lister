import Villager from './models/villager.model';
import VillagerList from './models/villagerlist.model';
import AppStateService from './state/state.service';
import VillagersRepository from './repository/villagers.repository';
import ListsView from './views/lists.view';
import ProfileView from './views/profile.view';
import SearchView from './views/search.view';
import { saveAs } from 'file-saver';
import lozad from 'lozad';

export default class Controller {
    private villagersRepo: VillagersRepository;
    private state: AppStateService;
    private searchView: SearchView;
    private profileView: ProfileView;
    private listsView: ListsView;
    private lozadObserver: lozad.Observer;

    constructor() {
        this.lozadObserver = lozad();
        this.villagersRepo = new VillagersRepository();
        this.state = new AppStateService();
        this.searchView = new SearchView();
        this.subscribeToSearchView();
        this.profileView = new ProfileView();
        this.subscribeToProfileView();
        this.listsView = new ListsView();
        this.subscribeToListsView();
    }

    private init(): void {
        this.listsView.init(this.getListsWithFullMembers());
        this.profileView.init(this.getListsWithFullMembers());
        this.searchView.init(this.villagersRepo.getAllVillagers());
        this.observeLazyLoadedImages();
    }

    private updateSearch(query: string): void {
        let results: Villager[];
        if (query === 'birthday') {
            results = this.villagersRepo.findVillagersWhosBirthdayIsToday();
        } else {
            results = this.villagersRepo.searchFor(query);
        }
        this.searchView.updateSearchResults(results);
        this.observeLazyLoadedImages();
    }

    private loadProfile(villagerId: string, listId?: string): void {
        const villager = this.villagersRepo.getVillagerById(villagerId);
        this.profileView.updateProfile(villager, listId);
    }

    private newList(): void {
        const newList: VillagerList = this.state.addNewList();
        this.listsView.displayNewList(this.getListByIdWithFullMembers(newList.id));
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
        this.state.addVillagerToList(villagerIdToAdd, listId);
        this.updateListMembersToViews(listId);
    }

    private removeVillagerFromList(villagerIdToAdd: string, listId: string): void {
        this.state.removeVillagerFromList(villagerIdToAdd, listId);
        this.updateListMembersToViews(listId);
    }

    private updateListMembersToViews(listId: string): void {
        this.listsView.updateMembersForList(listId, this.getListByIdWithFullMembers(listId).fullMembers);
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

    private importLists(listsFile: File): void {
        // TODO: Move file reading logic to Controller? (state.overrideLists())
        this.state.importListFromFile(listsFile, () => { this.overrideLists(); });
    }

    private overrideLists(): void {
        this.listsView.updateLists(this.getListsWithFullMembers());
        this.profileView.updateLists(this.state.getLists());
        this.observeLazyLoadedImages();
    }

    private subscribeToSearchView(): void {
        this.searchView.searchQueryUpdated$.subscribe((query: string) => {
            this.updateSearch(query);
        });
        this.searchView.searchResultClicked$.subscribe((villager: Villager) => {
            this.loadProfile(villager.id);
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
        this.listsView.listMemberButtonClicked$.subscribe((payload: { villagerId: string, listId: string }) => {
            this.loadProfile(payload.villagerId, payload.listId);
        });
    }

    private getListsWithFullMembers(): VillagerList[] {
        const lists = this.state.getLists();
        lists.map(list => this.addFullMembersToList(list));
        return lists;
    }

    private getListByIdWithFullMembers(listId: string): VillagerList {
        return this.addFullMembersToList(this.state.getListById(listId));
    }

    private addFullMembersToList(list: VillagerList): VillagerList {
        list.fullMembers = list.members.map(memberId => this.villagersRepo.getVillagerById(memberId));
        return list;
    }

    private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
