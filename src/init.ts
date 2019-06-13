import { clearAllLists, exportLists, importListsFromFile, loadWipProfileImage, newList, observeLazyLoadedImages, openImportDialog, percentageOfVillagersWithProfileImage, updateAddVillagerButton, updateSearch, viewLists } from './actions';
import { getElement as $ } from './util/util';
import villagersDB from './util/villagers.json';

function init(): void {
    bindEvents();
    updateSearch();
    viewLists();
    observeLazyLoadedImages();
    exposeHelperFunctionsToConsole();
    exposeVillagersDB();
}

function bindEvents(): void {
    $('profile_image').onerror = loadWipProfileImage;
    $('search_bar').oninput = updateSearch;
    $('search_button').onclick = updateSearch;
    $('newlist_button').onclick = newList;
    $('clearlists_button').onclick = clearAllLists;
    $('exportlists_button').onclick = exportLists;
    $('importlists_button').onclick = openImportDialog;
    $('file_input').onchange = importListsFromFile;
    $('list_select').onchange = updateAddVillagerButton;
}

function exposeHelperFunctionsToConsole() {
    // @ts-ignore
    window.percentageOfVillagersWithProfileImage = percentageOfVillagersWithProfileImage;
}

function exposeVillagersDB() {
    // @ts-ignore
    window.villagers = villagersDB;
}

init();
