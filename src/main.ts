import { aBirthdayIcon, aBirthdayTextNode, aCoffeeIcon, aListDropdownOption, anAddOrRemoveElement, anAddVillagerToListButton, aNameIcon, aPersonalityIcon, aRemoveVillagerFromListButton, aSpeciesIcon, aStoreIconButton, aTextNode, aWikiIconButton } from './components';
import ListsView from './lists.view';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';
import SearchView from './search.view';
import { aBreakElement, clearElement } from './util';
import villagers from './villagers.json';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

// Global variables:
let idCount = -1;
let currentListSelect = -1;
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

export function birthdayIsToday(birthdayString: string): boolean {
    const today: Date = new Date();
    const birthday: Date = new Date(birthdayString);
    return today.getDate() === birthday.getDate()
        && today.getMonth() === birthday.getMonth();
}

export function updateProfile(villager: Villager): void {
    clearElement($('profile'));

    $('profile').appendChild(aNameIcon());
    $('profile').appendChild(aTextNode(villager.name));
    $('profile').appendChild(aBreakElement());

    $('profile').appendChild(aSpeciesIcon());
    $('profile').appendChild(aTextNode(villager.species));
    $('profile').appendChild(aBreakElement());

    $('profile').appendChild(aPersonalityIcon());
    $('profile').appendChild(aTextNode(villager.personality));
    $('profile').appendChild(aBreakElement());

    $('profile').appendChild(aCoffeeIcon());
    $('profile').appendChild(aTextNode(villager.coffee));
    $('profile').appendChild(aBreakElement());

    $('profile').appendChild(aBirthdayIcon(villager));
    $('profile').appendChild(aBirthdayTextNode(villager.birthday));

    $('profile').appendChild(anAddOrRemoveElement());
    $('profile').appendChild(aBreakElement());
    $('profile').appendChild(aWikiIconButton(villager.wiki));
    $('profile').appendChild(aStoreIconButton(villager.store));
}

function updateProfileImage(villager: Villager): void {
    let profileImageElement: HTMLImageElement = <HTMLImageElement>$('profile-image');
    profileImageElement.alt = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
    profileImageElement.title = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
    profileImageElement.src = `./villager_heads/${villager.head}`;
}

function villagerHasProfileImage(villager: Villager): boolean {
    return villager.head !== 'wip.jpg';
}

export function loadProfile(id: string) {
    currentProfile = id;
    updateProfile(getVillager(id));
    updateCurrentListSelect();
    updateListSelect();
    updateProfileImage(getVillager(id));

    // Transition:
    /* // Hide:
    let results = document.querySelectorAll<HTMLElement>('#info *');
    for (let i = 0; i < results.length; i++) {
        results[i].style.opacity = '0';
    }
    // Show:
    setTimeout(function () {
        let results = document.querySelectorAll<HTMLElement>('#info *');
        for (let i = 0; i < results.length; i++) {
            results[i].style.opacity = '1';
        }
    }, 100); */
}

// Update the select for selecting a list
export function updateListSelect(selectedListId: number = currentListSelect): void {
    if (!aProfileIsSelected()) { return; }

    clearElement($('list_select'));

    if (listsAreEmpty()) {
        (<HTMLSelectElement>$('list_select')).disabled = true;
    } else {
        for (let list of lists) {
            (<HTMLSelectElement>$('list_select')).disabled = false;
            $('list_select').appendChild(aListDropdownOption(list, list.id == selectedListId));
        }
    }

    updateAddVillagerButton();
}

function aProfileIsSelected(): boolean {
    return currentProfile !== '';
}

export function updateAddVillagerButton(): void {
    clearElement($('add_remove_button'));
    if (villagerInList(currentProfile, getListSelectValue())) {
        $('add_remove_button').appendChild(aRemoveVillagerFromListButton());
    } else {
        $('add_remove_button').appendChild(anAddVillagerToListButton());
    }
}

export function getListSelectValue(): number {
    return +(<HTMLSelectElement>$('list_select')).value;
}

function villagerInList(villagerName: string, listId: number): boolean {
    return !listsAreEmpty() && lists.find(l => l.id == listId).members.includes(villagerName);
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
    updateListSelect();
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
    updateListSelect(); // Update list select
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
    updateListSelect();
}

export function deleteList(id: number): void {
    const listToDelete = lists.find(l => l.id == id);

    if (confirm(`Are you sure you want to delete "${listToDelete.title}"?`)) {
        lists = lists.filter(l => l.id != id);
        viewLists();
        updateListSelect();
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
    updateListSelect();
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
        updateListSelect();
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

export function listsAreEmpty(): boolean {
    return lists.length <= 0;
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