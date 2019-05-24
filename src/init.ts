import { clearAllLists, exportLists, importLists, newList, openImportDialog, openViewer, updateAddVillagerButton, updateSearch, viewLists } from './actions';
import { getElement as $ } from './util/util';

function init(): void {
    updateSearch();
    bindEvents();
    viewLists();
}

function bindEvents(): void {
    $('search_bar').oninput = updateSearch;
    $('search_button').onclick = updateSearch;
    $('newlist_button').onclick = newList;
    $('exportlists_button').onclick = exportLists;
    $('importlists_button').onclick = openImportDialog;
    $('clearlists_button').onclick = clearAllLists;
    $('openviewer_button').onclick = openViewer;
    $('file_input').onchange = importLists;
    $('list_select').onchange = updateAddVillagerButton;
}

init();
