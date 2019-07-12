import Villager from './models/villager.model';
import VillagerList from './models/villagerlist.model';
import AppStateService from './util/state.service';
import VillagersRepository from './util/villagers.repository';
import ListsV from './views/lists.view';
import ProfileV from './views/profile.view';
import SearchV from './views/search.view';
import { saveAs } from 'file-saver';
import lozad from 'lozad';

export default class Controller {
    private villagersRepo: VillagersRepository;
    private state: AppStateService;
    private searchView: SearchV;
    private profileView: ProfileV;
    private listsView: ListsV;
    private lozadObserver: lozad.Observer;

    constructor() {
        this.lozadObserver = lozad();
        this.villagersRepo = new VillagersRepository();
        this.state = new AppStateService();
        this.searchView = new SearchV();
        this.subscribeToSearchView();
        this.profileView = new ProfileV();
        this.subscribeToProfileView();
        this.listsView = new ListsV();
        this.subscribeToListsView();
    }

    public init(): void {
        this.listsView.init(this.getListsWithFullMembers());
        this.profileView.init(this.getListsWithFullMembers());
        this.searchView.init(this.villagersRepo.getAllVillagers());
        this.observeLazyLoadedImages();
    }

    public updateSearch(query: string): void {
        let results: Villager[];
        if (query === 'birthday') {
            results = this.villagersRepo.findVillagersWhosBirthdayIsToday();
        } else {
            results = this.villagersRepo.searchFor(query);
        }
        this.searchView.updateResults(results);
        this.observeLazyLoadedImages();
    }

    public loadProfile(villagerId: string, listId?: string): void {
        const villager = this.villagersRepo.getVillagerById(villagerId);
        this.profileView.updateProfile(villager, listId);
    }

    public newList(): void {
        const newList: VillagerList = this.state.addNewList();
        this.listsView.displayNewList(this.getListByIdWithFullMembers(newList.id));
        this.profileView.updateLists(this.state.getLists());
    }

    public clearLists(): void {
        this.state.clearAllLists();
        this.listsView.viewNoLists();
        this.profileView.updateLists(this.state.getLists());
    }

    public deleteList(listId: string): void {
        this.state.deleteList(listId);
        this.listsView.removeListFromView(listId);
        this.profileView.updateLists(this.state.getLists());
    }

    public renameList(listId: string, newTitle: string): void {
        const renamedList = this.state.renameList(listId, newTitle);
        this.listsView.displayUpdatedList(renamedList);
        this.profileView.updateLists(this.state.getLists());
    }

    public addVillagerToList(villagerIdToAdd: string, listId: string): void {
        this.state.addVillagerToList(villagerIdToAdd, listId);
        this.listsView.updateMembersForList(listId, this.getListByIdWithFullMembers(listId).fullMembers);
        this.profileView.updateLists(this.state.getLists());
        this.observeLazyLoadedImages();
    }

    public removeVillagerFromList(villagerIdToAdd: string, listId: string): void {
        this.state.removeVillagerFromList(villagerIdToAdd, listId);
        this.listsView.updateMembersForList(listId, this.getListByIdWithFullMembers(listId).fullMembers);
        this.profileView.updateLists(this.state.getLists());
        this.observeLazyLoadedImages();
    }

    public selectList(listId: string): void {
        this.profileView.selectList(listId);
    }

    public exportLists(): void {
        const blob = new Blob([JSON.stringify(this.state.getLists(), null, 2)], { type: 'text/plain' });
        saveAs(blob, 'ACLists.json');
    }

    public importLists(listsFile: File): void {
        this.state.importListFromFile(listsFile, () => { this.overrideLists(); });
        this.overrideLists();
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
        this.listsView.clearAllListsButtonClicked$.subscribe(() => {
            this.clearLists();
        });
        this.listsView.deleteListButtonClicked$.subscribe((list: VillagerList) => {
            this.deleteList(list.id);
        });
        this.listsView.applyTitleToListButtonClicked$.subscribe((payload: { listId: string, newTitle: string }) => {
            this.renameList(payload.listId, payload.newTitle);
        });
        this.listsView.listMemberButtonClicked$.subscribe((payload: { villagerId: string, listId: string }) => {
            this.loadProfile(payload.villagerId);
            this.selectList(payload.listId);
        });
        this.listsView.exportListsClicked$.subscribe(() => {
            this.exportLists();
        });
        this.listsView.importListsFileSelected$.subscribe((file: File) => {
            this.importLists(file);
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

    private overrideLists(): void {
        this.listsView.init(this.state.getLists());
        this.profileView.updateLists(this.state.getLists());
        this.observeLazyLoadedImages();
    }

    private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
