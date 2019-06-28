import Villager from './models/villager.model';
import VillagerList from './models/villagerlist.model';
import AppStateService from './util/state.service';
import VillagersRepository from './util/villagers.repository';
import IListsController from './views/interfaces/listscontroller.interface';
import IProfileController from './views/interfaces/profilecontroller.interface';
import ISearchController from './views/interfaces/searchcontroller.interface';
import ListsV from './views/lists.view';
import ProfileV from './views/profile.view';
import SearchV from './views/search.view';
import { saveAs } from 'file-saver';
import lozad from 'lozad';

export default class Controller implements ISearchController, IProfileController, IListsController {
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
        this.searchView = new SearchV(this);
        this.profileView = new ProfileV(this);
        this.listsView = new ListsV(this);
    }

    public init(): void {
        this.searchView.init(this.villagersRepo.getAllVillagers());
        this.profileView.init(this.state.getLists());
        this.listsView.init(this.state.getLists());
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
        this.listsView.displayNewList(newList);
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
        this.listsView.updateMembersForList(listId, this.state.getListById(listId).members);
        this.profileView.updateLists(this.state.getLists());
        this.observeLazyLoadedImages();
    }

    public removeVillagerFromList(villagerIdToAdd: string, listId: string): void {
        this.state.removeVillagerFromList(villagerIdToAdd, listId);
        this.listsView.updateMembersForList(listId, this.state.getListById(listId).members);
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

    private overrideLists(): void {
        this.listsView.init(this.state.getLists());
        this.profileView.updateLists(this.state.getLists());
        this.observeLazyLoadedImages();
    }

    private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
