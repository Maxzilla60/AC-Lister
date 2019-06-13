import { Villager } from './models/villager.model';
import { stateService } from './util/state.service';
import { birthdayIsToday, getElement as $, getListSelectValue, removeDuplicates } from './util/util';
import villagersDB from './util/villagers.json';
import ListsView from './views/lists.view';
import ProfileView from './views/profile.view';
import SearchView from './views/search.view';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';

// TODO: Refactor this to a class (Controller)

export const villagers = villagersDB;

export function viewLists(withListToRenameId?: string): void {
    ListsView.updateView(withListToRenameId);
    ProfileView.updateListSelect();
}

export function renameList(listId: string): void {
    viewLists(listId);
}

export function loadProfile(id: string, fromListId: string = getListSelectValue()): void {
    ProfileView.updateView(getVillagerById(id), fromListId);
}

export function addVillager(villagerNameToAdd: string, listId: string): void {
    if (villagerNameToAdd !== '') {
        stateService.addVillagerToList(villagerNameToAdd, listId);
        viewLists();
    }
}

export function removeVillager(villagerNameToRemove: string, listId: string): void {
    if (villagerNameToRemove !== '') {
        stateService.removeVillagerFromList(villagerNameToRemove, listId);
        viewLists();
    }
}

export function newList(): void {
    const newListID = stateService.addNewList();
    viewLists(newListID);
}

export function deleteList(id: string): void {
    const listToDelete = stateService.getListById(id);

    if (confirm(`Are you sure you want to delete "${listToDelete.title}"?`)) {
        stateService.deleteList(id);
        viewLists();
    }
}

export function applyTitle(listId: string, newTitle: string): void {
    if (newTitle !== '') {
        stateService.renameList(listId, newTitle);
    }
    viewLists();
}

export function clearAllLists(): void {
    if (confirm('Are you sure you want to clear all lists?')) {
        stateService.clearAllLists();
        viewLists();
    }
}

export function updateAddVillagerButton(): void {
    stateService.currentListSelect = getListSelectValue();
    ProfileView.updateAddVillagerButton();
}

export function updateSearch(): void {
    search(($('search_bar') as HTMLInputElement).value);
}

export function openImportDialog(): void {
    $('file_input').click();
}

export function birthdayHurray(): void {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC0CB'],
    });
    new Audio('./happybirthday.mp3').play();
}

// Export lists as .json file
export function exportLists(): void {
    const blob = new Blob([JSON.stringify(stateService.getLists(), null, 2)], { type: 'text/plain' });
    saveAs(blob, 'ACLists.json');
}

// Import lists from .json file
export function importListsFromFile(): void {
    if (!stateService.listsAreEmpty()) {
        if (!confirm('Are you sure you want to override current lists?')) {
            return;
        }
    }
    const selectedFile = ($('file_input') as HTMLInputElement).files[0];
    stateService.importListFromFile(selectedFile, viewLists);
}

function getVillagerById(villagerId: string): Villager {
    return villagersDB.find((v: Villager) => v.id === villagerId);
}

function search(query: string): void {
    $('search_bar').className = '';
    if (query === '') {
        SearchView.updateView();
        return;
    }

    query = query.toLowerCase();

    let results: Villager[];
    if (query === 'birthday') {
        $('search_bar').className = 'birthday';
        results = filterVillagersWhosBirthdayIsToday(results);
    } else {
        results = [
            ...filterVillagersOnName(query),
            ...filterVillagersOnPersonality(query),
            ...filterVillagersOnSpecies(query)
        ];
    }

    results = removeDuplicates(results);
    SearchView.updateView(results);
}

function filterVillagersWhosBirthdayIsToday(results: Villager[]): Villager[] {
    return villagersDB.filter((villager: Villager) => birthdayIsToday(villager.birthday));
}

function filterVillagersOnName(nameQuery: string): Villager[] {
    return villagersDB.filter((villager: Villager) => villager.name.toLowerCase().includes(nameQuery));
}

function filterVillagersOnPersonality(personalityQuery: string): Villager[] {
    return villagersDB.filter((villager: Villager) => villager.personality.toLowerCase().includes(personalityQuery));
}

function filterVillagersOnSpecies(speciesQuery: string): Villager[] {
    return villagersDB.filter((villager: Villager) => villager.species.toLowerCase().includes(speciesQuery));
}

// Show loading icon in search bar
function searchbarLoading(): void {
    $('search_results').innerHTML = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
}

export function percentageOfVillagersWithProfileImage(): string {
    const allVillagersCount = villagersDB.length;
    const villagersWithProfileImageCount = villagersDB
        .filter((v: Villager) => v.head !== 'wip.jpg')
        .length;

    const percentage = Math.floor((villagersWithProfileImageCount / allVillagersCount) * 100);
    return `${percentage}% of all villagers have a profile image. (${villagersWithProfileImageCount}/${allVillagersCount})`;
}
