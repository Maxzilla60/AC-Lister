import { Villager } from './models/villager.model';
import { stateService } from './util/state.service';
import { birthdayIsToday, getElement as $, getListSelectValue, removeDuplicates } from './util/util';
import villagersDB from './util/villagers.json';
import ListsView from './views/lists.view';
import ProfileView from './views/profile.view';
import SearchView from './views/search.view';
import { saveAs } from 'file-saver';

export const villagers = villagersDB;

function viewLists(withListToRenameId?: string): void {
    ListsView.updateView(withListToRenameId);
    ProfileView.updateListSelect();
}

export function renameList(listId: string): void {
    viewLists(listId);
}

export function loadProfile(id: string, fromListId: string = getListSelectValue()): void {
    ProfileView.updateView(getVillagerById(id), fromListId);
}

export function search(query: string): void {
    if (query === '') {
        SearchView.updateView();
        return;
    }

    query = query.toLowerCase();

    const villagersFilteredOnName = villagersDB.filter(
        (villager: Villager) => villager.name.toLowerCase().includes(query)
    );
    const villagersFilteredOnPersonality = villagersDB.filter(
        (villager: Villager) => villager.personality.toLowerCase().includes(query)
    );
    const villagersFilteredOnSpecies = villagersDB.filter(
        (villager: Villager) => villager.species.toLowerCase().includes(query)
    );

    let results: Villager[] = [...villagersFilteredOnName, ...villagersFilteredOnPersonality, ...villagersFilteredOnSpecies];
    results = removeDuplicates(results);

    SearchView.updateView(results);
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

function getVillagerById(villagerId: string): Villager {
    return villagersDB.find((v: Villager) => v.id === villagerId);
}

// Show loading icon in search bar
function searchbarLoading(): void {
    $('search_results').innerHTML = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
}

export function clearAllLists(): void {
    if (confirm('Are you sure you want to clear all lists?')) {
        stateService.clearAllLists();
        viewLists();
    }
}

export function updateAddVillagerButton(): void {
    ProfileView.updateAddVillagerButton();
}

// TODO
export function openViewer(): void {
    // window.location.href = 'viewer/index.html';
}

// Export lists as .json file
export function exportLists(): void {
    const blob = new Blob([JSON.stringify(stateService.getLists(), null, 2)], { type: 'text/plain' });
    saveAs(blob, 'ACLists.json');
}

// Import lists from .json file
export function importLists(): void {
    if (!stateService.listsAreEmpty()) {
        if (!confirm('Are you sure you want to override current lists?')) {
            return;
        }
    }
    const selectedFile = (<HTMLInputElement>$('file-input')).files[0];
    stateService.importListFromFile(selectedFile, viewLists);
}

export function getVillagersWhosBirthdayIsToday(): string[] {
    return villagersDB
        .filter((v: Villager) => birthdayIsToday(v.birthday))
        .map((v: Villager) => v.name);
}
export function percentageOfVillagersWithProfileImage(): string {
    const allVillagersCount = villagersDB.length;
    const villagersWithProfileImageCount = villagersDB
        .filter((v: Villager) => v.head !== 'wip.jpg')
        .length;

    const percentage = Math.floor((villagersWithProfileImageCount / allVillagersCount) * 100);
    return `${percentage}% of all villagers have a profile image. (${villagersWithProfileImageCount}/${allVillagersCount})`;
}

export function init(): void {
    search((<HTMLInputElement>$('search_bar')).value);
    viewLists();
}
