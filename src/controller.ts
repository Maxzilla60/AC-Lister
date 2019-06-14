import { Villager } from './models/villager.model';
import { stateService } from './util/state.service';
import { birthdayIsToday, getElement as $, getListSelectValue, removeDuplicates } from './util/util';
import villagersDB from './util/villagers.json';
import ListsView from './views/lists.view';
import ProfileView from './views/profile.view';
import SearchView from './views/search.view';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import lozad from 'lozad';

// TODO: Refactor to updateListsView() & updateSearchView()

export default class Controller {
    private static readonly lozadObserver = lozad();

    public static init(): void {
        Controller.updateSearch();
        Controller.viewLists();
        Controller.observeLazyLoadedImages();
    }

    public static observeLazyLoadedImages() { Controller.lozadObserver.observe(); }

    public static viewLists(withListToRenameId?: string): void {
        ListsView.updateView(withListToRenameId);
        ProfileView.updateListSelect();
        Controller.observeLazyLoadedImages();
    }

    public static renameList(listId: string): void {
        Controller.viewLists(listId);
    }

    public static loadProfile(id: string, fromListId: string = getListSelectValue()): void {
        ProfileView.updateView(Controller.getVillagerById(id), fromListId);
    }

    public static addVillager(villagerNameToAdd: string, listId: string): void {
        if (villagerNameToAdd !== '') {
            stateService.addVillagerToList(villagerNameToAdd, listId);
            Controller.viewLists();
        }
    }

    public static removeVillager(villagerNameToRemove: string, listId: string): void {
        if (villagerNameToRemove !== '') {
            stateService.removeVillagerFromList(villagerNameToRemove, listId);
            Controller.viewLists();
        }
    }

    public static newList(): void {
        const newListID = stateService.addNewList();
        Controller.viewLists(newListID);
    }

    public static deleteList(id: string): void {
        const listToDelete = stateService.getListById(id);

        if (confirm(`Are you sure you want to delete "${listToDelete.title}"?`)) {
            stateService.deleteList(id);
            Controller.viewLists();
        }
    }

    public static applyTitle(listId: string, newTitle: string): void {
        if (newTitle !== '') {
            stateService.renameList(listId, newTitle);
        }
        Controller.viewLists();
    }

    public static clearAllLists(): void {
        if (confirm('Are you sure you want to clear all lists?')) {
            stateService.clearAllLists();
            Controller.viewLists();
        }
    }

    public static updateAddVillagerButton(): void {
        stateService.currentListSelect = getListSelectValue();
        ProfileView.updateAddVillagerButton();
    }

    public static updateSearch(): void {
        Controller.search(($('search_bar') as HTMLInputElement).value);
    }

    public static openImportDialog(): void {
        $('file_input').click();
    }

    public static birthdayHurray(): void {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFC0CB'],
        });
        new Audio('./happybirthday.mp3').play();
    }

    public static loadWipProfileImage() {
        // @ts-ignore
        this.src = './villager_heads/wip.jpg';
        // @ts-ignore
        this.alt = 'Profile image not available (yet)';
        // @ts-ignore
        this.title = 'Profile image not available (yet)';
    }

    // Export lists as .json file
    public static exportLists(): void {
        const blob = new Blob([JSON.stringify(stateService.getLists(), null, 2)], { type: 'text/plain' });
        saveAs(blob, 'ACLists.json');
    }

    // Import lists from .json file
    public static importListsFromFile(): void {
        if (!stateService.listsAreEmpty()) {
            if (!confirm('Are you sure you want to override current lists?')) {
                return;
            }
        }
        const selectedFile = ($('file_input') as HTMLInputElement).files[0];
        stateService.importListFromFile(selectedFile, viewLists);
    }

    public static percentageOfVillagersWithProfileImage(): string {
        const allVillagersCount = villagersDB.length;
        const villagersWithProfileImageCount = villagersDB
            .filter((v: Villager) => v.head !== 'wip.jpg')
            .length;

        const percentage = Math.floor((villagersWithProfileImageCount / allVillagersCount) * 100);
        return `${percentage}% of all villagers have a profile image. (${villagersWithProfileImageCount}/${allVillagersCount})`;
    }

    private static getVillagerById(villagerId: string): Villager {
        return villagersDB.find((v: Villager) => v.id === villagerId);
    }

    private static search(query: string): void {
        $('search_bar').className = '';
        if (query === '') {
            SearchView.updateView();
            Controller.observeLazyLoadedImages();
            return;
        }

        query = query.toLowerCase();

        let results: Villager[];
        if (query === 'birthday') {
            $('search_bar').className = 'birthday';
            results = Controller.filterVillagersWhosBirthdayIsToday(results);
        } else {
            results = [
                ...Controller.filterVillagersOnName(query),
                ...Controller.filterVillagersOnPersonality(query),
                ...Controller.filterVillagersOnSpecies(query)
            ];
        }

        results = removeDuplicates(results);
        SearchView.updateView(results);
        Controller.observeLazyLoadedImages();
    }

    private static filterVillagersWhosBirthdayIsToday(results: Villager[]): Villager[] {
        return villagersDB.filter((villager: Villager) => birthdayIsToday(villager.birthday));
    }

    private static filterVillagersOnName(nameQuery: string): Villager[] {
        return villagersDB.filter((villager: Villager) => villager.name.toLowerCase().includes(nameQuery));
    }

    private static filterVillagersOnPersonality(personalityQuery: string): Villager[] {
        return villagersDB.filter((villager: Villager) => villager.personality.toLowerCase().includes(personalityQuery));
    }

    private static filterVillagersOnSpecies(speciesQuery: string): Villager[] {
        return villagersDB.filter((villager: Villager) => villager.species.toLowerCase().includes(speciesQuery));
    }
}
