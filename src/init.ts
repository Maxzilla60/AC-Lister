import { clearAllLists, exportLists, importListsFromFile, newList, openImportDialog, percentageOfVillagersWithProfileImage, updateAddVillagerButton, updateSearch, viewLists } from './actions';
import { getElement as $ } from './util/util';

function init(): void {
    bindEvents();
    updateSearch();
    viewLists();
}

function bindEvents(): void {
    $('search_bar').oninput = updateSearch;
    $('search_button').onclick = updateSearch;
    $('newlist_button').onclick = newList;
    $('clearlists_button').onclick = clearAllLists;
    $('exportlists_button').onclick = exportLists;
    $('importlists_button').onclick = openImportDialog;
    $('file_input').onchange = importListsFromFile;
    $('list_select').onchange = updateAddVillagerButton;
    exposeHelperFunctionsToConsole();
}

function exposeHelperFunctionsToConsole() {
    // @ts-ignore
    window.percentageOfVillagersWithProfileImage = percentageOfVillagersWithProfileImage;
}

init();
