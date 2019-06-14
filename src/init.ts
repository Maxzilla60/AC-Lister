import Controller, { loadWipProfileImage } from './controller';
import { getElement as $ } from './util/util';
import villagersDB from './util/villagers.json';

function init(): void {
    bindEvents();
    Controller.init();
    exposeHelperFunctionsToConsole();
    exposeVillagersDB();
}

function bindEvents(): void {
    $('profile_image').onerror = () => { loadWipProfileImage($('profile_image') as HTMLImageElement); };
    $('search_bar').oninput = Controller.updateSearch;
    $('search_button').onclick = Controller.updateSearch;
    $('newlist_button').onclick = Controller.newList;
    $('clearlists_button').onclick = Controller.clearAllLists;
    $('exportlists_button').onclick = Controller.exportListsAsJSONFile;
    $('importlists_button').onclick = Controller.openImportDialog;
    $('file_input').onchange = Controller.importListsFromFile;
    $('list_select').onchange = Controller.updateAddVillagerButton;
}

function exposeHelperFunctionsToConsole() {
    // @ts-ignore
    window.percentageOfVillagersWithProfileImage = Controller.percentageOfVillagersWithProfileImage;
}

function exposeVillagersDB() {
    // @ts-ignore
    window.villagers = villagersDB;
}

init();
