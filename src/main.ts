import { aListDeleteButton, aListDropdownOption, aListRenameButton, aListRenameConfirmButton, aListTitleElement, aListTitleInputElement, anAddVillagerToListButton, anEmptyListInfoElement, aRemoveVillagerFromListButton, aVillagerSearchResultButton, aVillagersIconsSection } from './components';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';
import villagers from './villagers.json';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

// Global variables:
let idCount = -1;
export let currentProfile = "";
let currentListSelect = -1;
export let lists: VillagerList[] = [];

// Display lists in list area
function viewLists() {
    clearElement($('lists'));
    updateListsFromLocalStorage();
    var listContentElement: HTMLElement = document.createElement('div');

    if (!listsAreEmpty()) {
        for (let list of lists) {
            listContentElement.appendChild(aListTitleElement(list));
            listContentElement.appendChild(aListDeleteButton(list));
            listContentElement.appendChild(aListRenameButton(list));
            listContentElement.appendChild(aVillagersIconsSection(list));
        }
    }
    else {
        listContentElement = anEmptyListInfoElement();;
    }

    updateListEditingButtons();
    $('lists').appendChild(listContentElement);
}

function updateListEditingButtons(): void {
    var exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('export_lists');
    var clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clear_lists');
    if (!listsAreEmpty()) {
        exportListsButton.className = "clickable fa fa-download";
        exportListsButton.disabled = false;
        clearListsButton.className = "clickable fa fa-times";
        clearListsButton.disabled = false;
    } else {
        exportListsButton.className = "disabled fa fa-download";
        exportListsButton.disabled = true;
        clearListsButton.className = "disabled fa fa-times";
        clearListsButton.disabled = true;
    }
}

function updateListsFromLocalStorage(): void {
    localStorage.lists = JSON.stringify(lists);
}

function viewResults(resultList: Villager[] = villagers): void {
    let searchResultsElement = $('search_results');
    clearElement(searchResultsElement);

    for (let villager of resultList) {
        searchResultsElement.appendChild(aVillagerSearchResultButton(villager));
        searchResultsElement.appendChild(document.createElement('br'));
    }

    // Transition:
    // Hide:
    document.querySelectorAll<HTMLElement>(".result")
        .forEach(result => result.style.opacity = '0');
    // Show:
    setTimeout(function () {
        document.querySelectorAll<HTMLElement>(".result")
            .forEach(result => result.style.opacity = '1');
    }, 100);
}

export function aWikiIconButton(wikiLink: string): HTMLButtonElement {
    let wikiIconButton: HTMLButtonElement = document.createElement('button');
    wikiIconButton.onclick = () => { window.open(wikiLink, '_blank'); }
    wikiIconButton.title = 'Open Wiki page';
    wikiIconButton.className = 'clickable fa fa-wikipedia-w';
    wikiIconButton.setAttribute('aria-hidden', 'true');
    return wikiIconButton;
}

export function aStoreIconButton(storeLink: string): HTMLButtonElement {
    let storeIconButton: HTMLButtonElement = document.createElement('button');
    storeIconButton.onclick = () => { window.open(storeLink, '_blank'); }
    storeIconButton.title = 'Buy this art!';
    storeIconButton.className = 'clickable fa fa-shopping-bag';
    storeIconButton.setAttribute('aria-hidden', 'true');
    return storeIconButton;
}

export function aNameIcon(): HTMLElement {
    let nameIconButton: HTMLElement = document.createElement('i');
    nameIconButton.title = 'Name';
    nameIconButton.className = 'fa fa-tag';
    nameIconButton.setAttribute('aria-hidden', 'true');
    return nameIconButton;
}

export function aSpeciesIcon(): HTMLElement {
    let speciesIconButton: HTMLElement = document.createElement('i');
    speciesIconButton.title = 'Species';
    speciesIconButton.className = 'fa fa-user';
    speciesIconButton.setAttribute('aria-hidden', 'true');
    return speciesIconButton;
}

export function aPersonalityIcon(): HTMLElement {
    let personalityIconButton: HTMLElement = document.createElement('i');
    personalityIconButton.title = 'Personality';
    personalityIconButton.className = 'fa fa-heart';
    personalityIconButton.setAttribute('aria-hidden', 'true');
    return personalityIconButton;
}

export function aCoffeeIcon(): HTMLElement {
    let coffeeIconButton: HTMLElement = document.createElement('i');
    coffeeIconButton.title = 'Favourite coffee';
    coffeeIconButton.className = 'fa fa-coffee';
    coffeeIconButton.setAttribute('aria-hidden', 'true');
    return coffeeIconButton;
}

export function aBirthdayIcon(): HTMLElement {
    let coffeeIconButton: HTMLElement = document.createElement('i');
    coffeeIconButton.title = 'Birthday';
    coffeeIconButton.className = 'fa fa-birthday-cake';
    coffeeIconButton.setAttribute('aria-hidden', 'true');
    return coffeeIconButton;
}

export function anAddOrRemoveElement(): HTMLElement {
    let addOrRemoveElement: HTMLElement = document.createElement('div');
    addOrRemoveElement.style.padding = '0';
    addOrRemoveElement.style.display = 'inline-block';
    return addOrRemoveElement;
}

export function aBreakElement(): HTMLElement {
    return document.createElement('br');
}

export function aTextNode(text: string): Text {
    return document.createTextNode(text);
}

export function anNASpanElement(): HTMLSpanElement {
    let naElement: HTMLSpanElement = document.createElement('span');
    naElement.className = 'na';
    naElement.innerHTML = 'N/A';
    return naElement;
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
    $('profile').appendChild(aTextNode(villager.coffee)); // TODO: Show N/A when empty
    $('profile').appendChild(aBreakElement());

    $('profile').appendChild(aBirthdayIcon());
    $('profile').appendChild(aTextNode(villager.birthday.toString())); // TODO: Show N/A when empty

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

// Display villager profile
export function loadProfile(id: string) {
    currentProfile = id;
    let villager: Villager = getVillager(id);

    updateProfile(villager);
    updateCurrentListSelect();
    updateListSelect();
    updateProfileImage(villager);

    // Transition:
    // Hide:
    let results = document.querySelectorAll<HTMLElement>("#info *");
    for (let i = 0; i < results.length; i++) {
        results[i].style.opacity = '0';
    }
    // Show:
    setTimeout(function () {
        let results = document.querySelectorAll<HTMLElement>("#info *");
        for (let i = 0; i < results.length; i++) {
            results[i].style.opacity = '1';
        }
    }, 100);

    return;
    currentProfile = id;
    updateCurrentListSelect();
    // let villager: Villager = getVillager(id);
    //let trimmedName = trimName(name); // Trim name for duplicate names
    // Get values from json:
    let birthday = "<span class=\"na\">N/A</span>";

    // Birthday Easter Egg:
    let today_date = new Date(); // Get today's date
    let birthday_date = new Date(birthday.toString()); // Convert birthday to Date
    // If villager's birthday's today:
    if (today_date.getDate() === birthday_date.getDate() && today_date.getMonth() === birthday_date.getMonth()) {
        // Highlight birthday string
        birthday = "<div class=\"birthday\">" + birthday + "</div>";
        // Fun little icon with a sound
        let icon_birthday = "<button title=\"Happy Birthday " + name + "!\" onclick=\"new Audio('happybirthday.mp3').play();\" style=\"color:hotpink;\" class=\" clickable fa fa-birthday-cake\" aria-hidden=\"true\"></button>";
    }
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

function clearElement(element: HTMLElement): void {
    element.innerHTML = '';
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
        viewResults(); // Display all villagers
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

    viewResults(results);
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

export function renameList(listId: number) {
    viewLists_Rename(listId);
}
function viewLists_Rename(listToRenameId: number): void {
    clearElement($('lists'));
    updateListsFromLocalStorage();
    var listContentElement: HTMLElement = document.createElement('div');

    if (!listsAreEmpty()) {
        for (let list of lists) {
            if (list.id == listToRenameId) {
                listContentElement.appendChild(aListTitleInputElement(list));
                listContentElement.appendChild(aListRenameConfirmButton(list));
            }
            else {
                listContentElement.appendChild(aListTitleElement(list));
                listContentElement.appendChild(aListDeleteButton(list));
                listContentElement.appendChild(aListRenameButton(list));
            }
            listContentElement.appendChild(aVillagersIconsSection(list));
        }
    }
    else {
        listContentElement = anEmptyListInfoElement();;
    }

    $('lists').appendChild(listContentElement);
    focusAndSelectRenameInput();
}

function focusAndSelectRenameInput() {
    $('rename_bar').focus();
    (<HTMLInputElement>$('rename_bar')).select();
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
    $('search_results').innerHTML = "<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i>";
}

export function clearAll(): void {
    if (confirm('Are you sure you want to clear all lists?')) {
        lists = [];
        idCount = -1;
        localStorage.idCount = idCount;
        viewLists();
    }
}

// Go to viewer
// TODO
function openViewer() {
    window.location.href = "viewer";
}

// Export lists as .json file
export function exportLists(): void {
    // TODO
    let blob = new Blob([JSON.stringify(lists, null, 2)], { type: "text/plain" });
    // saveAs(blob, "ACLists.json");
}

// Import lists from .json file
// TODO
function importLists() {
    let selectedFile = (<HTMLInputElement>$('file-input')).files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        // Confirm dialog on lists present:
        if (!listsAreEmpty()) {
            var confirmOverride = confirm("Are you sure you want to override current lists?");
        }
        else {
            var confirmOverride = true;
        }
        // Set lists if confirmed:
        if (confirmOverride) {
            lists = JSON.parse(reader.result as string); // Save lists
            findIDCount(); // Get idCount
            (<HTMLInputElement>$('file-input')).value = ""; // Reset input
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