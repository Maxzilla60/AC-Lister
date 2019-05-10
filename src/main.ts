import ListsView from './lists.view';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';
import ProfileView from './profile.view';
import SearchView from './search.view';
import { listsAreEmpty } from './util';
import villagers from './villagers.json';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

// Global variables:
let idCount = -1;
export let currentListSelect = -1;
export let currentProfile = '';
export let lists: VillagerList[] = [];
export const villagersDB = villagers;

function updateListsFromLocalStorage(): void {
    localStorage.lists = JSON.stringify(lists);
}

function viewLists() {
    updateListsFromLocalStorage();
    ListsView.updateView();
}

export function renameList(listId: number) {
    updateListsFromLocalStorage();
    ListsView.updateViewWithListTitleRenaming(listId);
}

export function loadProfile(id: string) {
    currentProfile = id;
    updateCurrentListSelect();
    ProfileView.updateView(getVillager(id));
}

export function aProfileIsSelected(): boolean {
    return currentProfile !== '';
}

export function getListSelectValue(): number {
    return +(<HTMLSelectElement>$('list_select')).value;
}

export function search(query: string): void {
    if (query == '') {
        SearchView.updateView();
        return;
    }

    query = query.toLowerCase();

    const villagersFilteredOnName = villagers.filter(
        (villager: Villager) => villager.name.toLowerCase().includes(query)
    );
    const villagersFilteredOnPersonality = villagers.filter(
        (villager: Villager) => villager.personality.toLowerCase().includes(query)
    );
    const villagersFilteredOnSpecies = villagers.filter(
        (villager: Villager) => villager.species.toLowerCase().includes(query)
    );

    let results: Villager[] = [...villagersFilteredOnName, ...villagersFilteredOnPersonality, ...villagersFilteredOnSpecies];
    results = removeDuplicates(results);

    SearchView.updateView(results);
}

function removeDuplicates(results: any[]): any[] {
    return [...new Set(results)];
}

// Add villager to list
export function addVillager(villagerNameToAdd: string, listId: number): void {
    updateCurrentListSelect();

    if (villagerNameToAdd === '') { return; }

    let listToAddTo: VillagerList = lists.find(l => l.id == listId);
    listToAddTo.members.push(villagerNameToAdd);
    listToAddTo.members.sort();

    viewLists();
    ProfileView.updateListSelect();
}

function updateCurrentListSelect(): void {
    currentListSelect = getListSelectValue();
}

export function removeVillager(name: string, id: number) {
    updateCurrentListSelect();

    let listToDeleteFrom = lists.find(l => l.id == id);
    listToDeleteFrom.members = listToDeleteFrom.members
        .filter(v => v !== name);

    viewLists(); // Refresh view
    ProfileView.updateListSelect(); // Update list select
}

export function newList(): void {
    idCount++; // Increment global count
    localStorage.idCount = idCount; // Update local storage

    lists.push({
        title: 'New List',
        id: idCount,
        members: []
    });

    viewLists();
    renameList(idCount); // Initiate rename of list
    ProfileView.updateListSelect();
}

export function deleteList(id: number): void {
    const listToDelete = lists.find(l => l.id == id);

    if (confirm(`Are you sure you want to delete "${listToDelete.title}"?`)) {
        lists = lists.filter(l => l.id != id);
        viewLists();
        ProfileView.updateListSelect();
    }
}

export function applyTitle(listId: number, newTitle: string): void {
    if (newTitle === '') {
        viewLists();
        return;
    }

    lists
        .find(l => l.id == listId)
        .title = newTitle;

    viewLists();
    ProfileView.updateListSelect();
}

function getVillager(villagerId: string): Villager {
    return villagers.find((v: Villager) => v.id === villagerId);
}

// Show loading icon in search bar
function searchbarLoading(): void {
    $('search_results').innerHTML = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>';
}

export function clearAll(): void {
    if (confirm('Are you sure you want to clear all lists?')) {
        lists = [];
        idCount = -1;
        localStorage.idCount = idCount;
        viewLists();
        ProfileView.updateListSelect();
    }
}

// Go to viewer
// TODO
function openViewer() {
    window.location.href = 'viewer';
}

// Export lists as .json file
export function exportLists(): void {
    // TODO
    let blob = new Blob([JSON.stringify(lists, null, 2)], { type: 'text/plain' });
    // saveAs(blob, 'ACLists.json');
}

// Import lists from .json file
// TODO
function importLists() {
    let selectedFile = (<HTMLInputElement>$('file-input')).files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        // Confirm dialog on lists present:
        if (!listsAreEmpty()) {
            var confirmOverride = confirm('Are you sure you want to override current lists?');
        }
        else {
            var confirmOverride = true;
        }
        // Set lists if confirmed:
        if (confirmOverride) {
            lists = JSON.parse(reader.result as string); // Save lists
            findIDCount(); // Get idCount
            (<HTMLInputElement>$('file-input')).value = ''; // Reset input
        }
        viewLists();
    }

    reader.readAsText(selectedFile);
}

// Retrieve largest id from lists
function findIDCount(): void {
    let temp = -1;

    for (let l in lists) {
        if (lists[l].id > temp) {
            temp = lists[l].id;
        }
    }

    localStorage.idCount = temp;
    idCount = localStorage.idCount;
}

export function init() {
    search((<HTMLInputElement>$('search_bar')).value);
    // Retrieve lists from local storage:
    if (localStorage.lists) {
        lists = JSON.parse(localStorage.lists);
    }
    // Retrieve idCount from local storage:
    if (localStorage.idCount) {
        idCount = localStorage.idCount;
    }
    viewLists();
}