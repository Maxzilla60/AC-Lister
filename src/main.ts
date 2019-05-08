import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';
import villagers from './villagers.json';

// Global variables:
let idCount = -1;
let currentProfile = "";
let currentListSelect = -1;
let lists: VillagerList[] = [];

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

// Display lists in list area
function viewLists() {
    clearElement($('lists'));
    updateListsFromLocalStorage();
    var listContentElement: HTMLElement = document.createElement('div');

    if (lists.length !== 0) {
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
    $("lists").appendChild(listContentElement);
}

function updateListEditingButtons(): void {
    var exportListsButton: HTMLButtonElement = <HTMLButtonElement>$('export_lists');
    var clearListsButton: HTMLButtonElement = <HTMLButtonElement>$('clear_lists');
    if (lists.length !== 0) {
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

function anEmptyListInfoElement(): HTMLElement {
    let emptyListInfoElement = document.createElement('div');
    emptyListInfoElement.style.paddingLeft = '15px';
    emptyListInfoElement.style.color = 'orange';
    emptyListInfoElement.innerHTML = 'Click<i onclick="index.newList();" title="Add list" class="clickable fa fa-plus" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!';
    return emptyListInfoElement;
}

function updateListsFromLocalStorage(): void {
    localStorage.lists = JSON.stringify(lists);
}

function aVillagersIconsSection(list: VillagerList): HTMLElement {
    let villagerIconsSection = aDivider();
    for (let villager of list.members) {
        villagerIconsSection.appendChild(aVillagerListIcon(villager, list));
    }
    return villagerIconsSection;
}

function aVillagerListIcon(villager: string, list: VillagerList): HTMLImageElement {
    let villagerListIcon: HTMLImageElement = document.createElement('img');
    villagerListIcon.onclick = () => {
        loadProfile(villager);
        updateListSelect(list.id);
    };
    villagerListIcon.title = trimName(villager);
    villagerListIcon.src = `./villager_icons/${villager}.gif`;
    return villagerListIcon;
}

function aDivider(): HTMLElement {
    var divider: HTMLElement = document.createElement('div');
    divider.style.paddingBottom = '0';
    divider.style.paddingTop = '0';
    return divider;
}

function aListTitleElement(list: VillagerList): HTMLButtonElement {
    let listTitleElement: HTMLButtonElement = document.createElement('button');
    listTitleElement.onclick = () => { updateListSelect(list.id); };
    listTitleElement.innerHTML = list.title;
    listTitleElement.className = 'clickable list';
    return listTitleElement;
}

function aListDeleteButton(list: VillagerList): HTMLButtonElement {
    let deleteButtonElement: HTMLButtonElement = document.createElement('button');
    deleteButtonElement.onclick = () => { deleteList(list.id); }
    deleteButtonElement.title = 'Delete list';
    deleteButtonElement.className = 'clickable fa fa-trash';
    deleteButtonElement.setAttribute('aria-hidden', 'true');
    return deleteButtonElement;
}

function aListRenameButton(list: VillagerList): HTMLButtonElement {
    let listRenameButtonElement: HTMLButtonElement = document.createElement('button');
    listRenameButtonElement.onclick = () => { renameList(list.id); }
    listRenameButtonElement.title = 'Edit list title';
    listRenameButtonElement.className = 'clickable fa fa-pencil';
    listRenameButtonElement.setAttribute('aria-hidden', 'true');
    return listRenameButtonElement;
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

function aVillagerSearchResultButton(villager: Villager): HTMLButtonElement {
    let villagersSearchResultButton: HTMLButtonElement = document.createElement('button');
    villagersSearchResultButton.onclick = () => { loadProfile(villager.id); };
    villagersSearchResultButton.className = 'result';
    villagersSearchResultButton.appendChild(aVillagersSearchResultImage(villager));
    villagersSearchResultButton.appendChild(aVillagersSearchResultNameElement());
    return villagersSearchResultButton;

    function aVillagersSearchResultNameElement(): HTMLElement {
        let villagersSearchResultNameElement: HTMLElement = document.createElement('div');
        villagersSearchResultNameElement.innerHTML = villager.name;
        return villagersSearchResultNameElement;
    }
}

function aVillagersSearchResultImage(villager: Villager) {
    let villagersSearchResultImage: HTMLImageElement = document.createElement('img');
    villagersSearchResultImage.alt = villager.name;
    villagersSearchResultImage.style.cssFloat = 'left';
    villagersSearchResultImage.src = `./villager_icons/${villager.id}.gif`;
    return villagersSearchResultImage;
}

// Display villager profile
export function loadProfile(id: string) {
    currentProfile = id;
    updateCurrentListSelect();
    let villager: Villager = getVillager(id);
    //let trimmedName = trimName(name); // Trim name for duplicate names
    // Get values from json:
    let name = villager.name;
    let head = villager.head;
    let species = villager.species;
    let personality = villager.personality;
    let coffee = villager.coffee;
    // In case of N/A:
    if (coffee == "") {
        coffee = "<div class=\"na\">N/A</div>";
    }
    let birthday = villager.birthday;
    // In case of N/A:
    if (birthday == "") {
        birthday = "<div class=\"na\">N/A</div>";
    }
    let wiki = villager.wiki;
    let store = villager.store;

    // Create Font Awesome blocks:
    let icon_wiki = "<button onclick=\"window.open('" + wiki + "','_blank');\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" aria-hidden=\"true\"></button>";
    let icon_store = "<button onclick=\"window.open('" + store + "','_blank');\" title=\"Buy this art!\" class=\"clickable fa fa-shopping-bag\" aria-hidden=\"true\"></button>";
    let icon_name = "<i title=\"Name\" class=\"fa fa-tag\" aria-hidden=\"true\"></i>";
    let icon_species = "<i title=\"Species\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    let icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    let icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    let icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    let icon_add = "<div id=\"add_remove_button\" style=\"padding:0;display:inline-block\"><button onclick=\"index.addVillager('" + id + "',document.getElementById('list_select').value);\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></button></div>";
    let br = "<br>";

    // Listselect:
    if (lists.length !== 0) {
        var listselect = "<div class=\"menu\"><select id=\"list_select\" onchange=\"index.updateAddVillagerButton();\"></select> ";
    }
    else {
        var listselect = "<div class=\"menu\"><select id=\"list_select\" disabled></select> ";
    }

    // In case of 'wip.jpg':
    if (head == "wip.jpg") {
        var block_head = "<img title=\"Image not available (yet)\" alt=\"Profile image (" + name + ")\" src=\"villager_heads/" + head + "\" class=\"profile-image\">" + "<div class=\"profile\">";
    }
    else {
        var block_head = "<img title=\"" + name + "\" alt=\"Profile image (" + name + ")\" src=\"villager_heads/" + head + "\" class=\"profile-image\">" + "<div class=\"profile\">";
    }

    // Birthday Easter Egg:
    let today_date = new Date(); // Get today's date
    let birthday_date = new Date(birthday.toString()); // Convert birthday to Date
    // If villager's birthday's today:
    if (today_date.getDate() === birthday_date.getDate() && today_date.getMonth() === birthday_date.getMonth()) {
        // Highlight birthday string
        birthday = "<div class=\"birthday\">" + birthday + "</div>";
        // Fun little icon with a sound
        icon_birthday = "<button title=\"Happy Birthday " + name + "!\" onclick=\"new Audio('happybirthday.mp3').play();\" style=\"color:hotpink;\" class=\" clickable fa fa-birthday-cake\" aria-hidden=\"true\"></button>";
    }

    // Assemble all blocks:
    let block = listselect + icon_add + "</div>" +
        block_head +
        icon_name + name + br +
        icon_species + species + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br +
        icon_wiki + icon_store + "</div>";
    // Display block
    $("info").innerHTML = block;
    updateListSelect(); // Update list select

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
}

// Update the select for selecting a list
export function updateListSelect(selectedListId: number = currentListSelect): void {
    if (!aProfileIsSelected() || lists.length <= 0) { return; }

    clearElement($('list_select'));

    for (let list of lists) {
        $('list_select').appendChild(aListDropdownOption(list, list.id == selectedListId));
    }

    updateAddVillagerButton();
}

function aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
    let dropdownOption: HTMLOptionElement = document.createElement('option');
    dropdownOption.innerHTML = list.title;
    dropdownOption.value = list.id.toString();
    dropdownOption.selected = isSelected;
    return dropdownOption;
}

function clearElement(element: HTMLElement): void {
    element.innerHTML = '';
}

function aProfileIsSelected(): boolean {
    return currentProfile !== "";
}

// Update the button for adding a villager
export function updateAddVillagerButton() {
    // Disabled button:
    if (lists.length <= 0) {
        let block = "<button title=\"Add to list\" class=\"disabled fa fa-plus\" aria-hidden=\"true\"></button>";
        $("add_remove_button").innerHTML = block;
    }
    // Remove button:
    else if (villagerInList(currentProfile, +(<HTMLInputElement>$("list_select")).value)) {
        let block = "<button onclick=\"index.removeVillager('" + currentProfile + "',document.getElementById('list_select').value);\" title=\"Remove from list\" class=\"clickable fa fa-minus\" aria-hidden=\"true\"></button>";
        $("add_remove_button").innerHTML = block;
    }
    // Add button:
    else {
        let block = "<button onclick=\"index.addVillager('" + currentProfile + "',document.getElementById('list_select').value);\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></button>";
        $("add_remove_button").innerHTML = block;
    }
}
// Check if villager is already in list
function villagerInList(name: string, id: number) {
    for (let l in lists) {
        if (lists[l].id == id) {
            for (let m in lists[l].members) {
                if (lists[l].members[m] == name) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function search(query: string): void {
    if (query == '') {
        viewResults(); // Display all villagers
        return;
    }

    query = query.toLowerCase();
    let results: Villager[] = [];

    const villagersFilteredOnName = villagers.filter(
        (villager: Villager) => villager.name.toLowerCase().includes(query)
    );
    const villagersFilteredOnPersonality = villagers.filter(
        (villager: Villager) => villager.personality.toLowerCase().includes(query)
    );
    const villagersFilteredOnSpecies = villagers.filter(
        (villager: Villager) => villager.species.toLowerCase().includes(query)
    );

    results = [...villagersFilteredOnName, ...villagersFilteredOnPersonality, ...villagersFilteredOnSpecies];
    results = removeDuplicates(results);

    viewResults(results);
}

function removeDuplicates(results: any[]): any[] {
    return [...new Set(results)];
}

// Add villager to list
export function addVillager(villagerNameToAdd: string, listId: number) {
    updateCurrentListSelect();

    if (villagerNameToAdd === '') { return; }

    let listToAddTo: VillagerList = lists.find(l => l.id == listId);
    listToAddTo.members.push(villagerNameToAdd);
    listToAddTo.members.sort();

    viewLists();
    updateListSelect();
}

function updateCurrentListSelect(): void {
    currentListSelect = +(<HTMLInputElement>$("list_select")).value;
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

function renameList(listId: number) {
    viewLists_Rename(listId);
}
function viewLists_Rename(listToRenameId: number): void {
    clearElement($('lists'));
    updateListsFromLocalStorage();
    var listContentElement: HTMLElement = document.createElement('div');

    if (lists.length !== 0) {
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

    $("lists").appendChild(listContentElement);
    focusAndSelectRenameInput();
}

function focusAndSelectRenameInput() {
    $("rename_bar").focus();
    (<HTMLInputElement>$("rename_bar")).select();
}

function aListTitleInputElement(list: VillagerList): HTMLInputElement {
    //"<input onchange=\"index.applyTitle(" + lists[l].id + ", document.getElementById('rename_bar').value);\" id=\"rename_bar\" type=\"text\"
    // value=\"" + lists[l].title + "\" maxlength=\"30\"></input>" +
    let listTitleInputElement: HTMLInputElement = document.createElement('input');
    listTitleInputElement.onchange = () => {
        applyTitle(list.id, (<HTMLInputElement>$('rename_bar')).value);
    }
    listTitleInputElement.id = 'rename_bar';
    listTitleInputElement.type = 'text';
    listTitleInputElement.value = list.title;
    listTitleInputElement.maxLength = 30;
    return listTitleInputElement;
}

function aListRenameConfirmButton(list: VillagerList): HTMLButtonElement {
    let listRenameButtonElement: HTMLButtonElement = document.createElement('button');
    listRenameButtonElement.onclick = () => {
        applyTitle(list.id, (<HTMLInputElement>$('rename_bar')).value);
    }
    listRenameButtonElement.title = 'Edit name';
    listRenameButtonElement.className = 'clickable fa fa-check';
    listRenameButtonElement.setAttribute('aria-hidden', 'true');
    return listRenameButtonElement;
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

// Trim '(2)' from name for duplicate names
function trimName(name: string) {
    if (name.includes("(2)")) {
        return name.replace(" (2)", "");
    }
    return name;
}

// Show loading icon in search bar
function searchbarLoading() {
    $("search_results").innerHTML = "<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i>";
}

export function clearAll() {
    if (confirm('Are you sure you want to clear all lists?')) {
        lists = [];
        idCount = -1;
        localStorage.idCount = idCount;
        viewLists();
    }
}

// Go to viewer
function openViewer() {
    window.location.href = "viewer";
}

function saveAs(blob: Blob, filename: string) { }

// Export lists as .json file
export function exportLists() {
    let blob = new Blob([JSON.stringify(lists, null, 2)], { type: "text/plain" });
    saveAs(blob, "ACLists.json");
}

// Import lists from .json file
function importLists() {
    let selectedFile = (<HTMLInputElement>$("file-input")).files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
        // Confirm dialog on lists present:
        if (lists.length > 0) {
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
function findIDCount() {
    let temp = -1; // Keep temporary value
    // Find largest id in lists:
    for (let l in lists) {
        if (lists[l].id > temp) {
            temp = lists[l].id;
        }
    }
    // Save idCount:
    localStorage.idCount = temp;
    idCount = localStorage.idCount;
}

// on page load:
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