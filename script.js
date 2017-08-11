// Global variables:
var idCount = -1;
var currentProfile = "";
var currentListSelect = -1;
var lists = [];

// Display lists in list area
function viewLists() {
    document.getElementById("lists").innerHTML = ""; // Clear list area
    localStorage.lists = JSON.stringify(lists); // Update local storage
    var block = "";
    
    if (lists.length !== 0) {
        // Create html block:
        block = "<div>";
        for (var l in lists) {
            block += "<div class=\"list\">" + lists[l].title + "</div>" +
                "<i onclick=\"deleteList(" + lists[l].id + ");\" title=\"Delete list\" class=\"clickable fa fa-trash\" aria-hidden=\"true\"></i>" +
                "<i onclick=\"renameList(" + lists[l].id + ");\" title=\"Edit name\" class=\"clickable fa fa-pencil\" aria-hidden=\"true\"></i><div style=\"padding-bottom:0;padding-top:0;\">";
            for (var member in lists[l].members) {
                trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
                block += "<img onclick=\"loadProfile('" + lists[l].members[member] + "');\" title=\"" + trimmedName + "\" src=\"villager_icons/" + lists[l].members[member] + ".gif\">";
            }
            block += "</div>";
        }
        block += "</div>";
    }
    // In case of empty list:
    else {
        block = "<div style=\"padding-left:15px;color:orange;\">Press the<i onclick=\"newList();\" title=\"Add list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\" style=\"margin-left:3px;margin-right:3px;\"></i>to make a new list!</div>";
    }
    
    // Display block
    document.getElementById("lists").innerHTML = block;
}

// Display search results in results bar
function viewResults(resultList) {
    document.getElementById("search_results").innerHTML = ""; // Clear results bar
    var block = "";
    
    for (var v in resultList) {
        //trimmedName = trimName(resultList[v].name); // Trim name for duplicate names
        
        // Create html block:
        block += "<div onclick=\"loadProfile('" + resultList[v].id + "');\" class=\"result\">" +
        "<img style=\"float:left\" src=\"villager_icons/" + resultList[v].id + ".gif\">" +
        "<div>" + resultList[v].name + "</div>" +
        "</div><br>";
    }
    
    // Display block
    document.getElementById("search_results").innerHTML = block;
}

// Display villager profile
function loadProfile(id) {
    currentProfile = id;
    currentListSelect = document.getElementById("list_select").value;
    var villager = getVillager(id); // Get villager json
    //var trimmedName = trimName(name); // Trim name for duplicate names
    // Get values from json:
    var name = villager.name;
    var head = villager.head;
    var species = villager.species;
    var personality = villager.personality;
    var coffee = villager.coffee;
    var birthday = villager.birthday;
    var wiki = villager.wiki;
    var store = villager.store;
    
    // Create Font Awesome blocks:
    var icon_wiki = "<i onclick=\"window.open('" + wiki + "','_blank');\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" aria-hidden=\"true\"></i>";
    var icon_store = "<i onclick=\"window.open('" + store + "','_blank');\" title=\"Buy this art!\" class=\"clickable fa fa-shopping-bag\" aria-hidden=\"true\"></i>";
    var icon_name = "<i title=\"Name\" class=\"fa fa-tag\" aria-hidden=\"true\"></i>";
    var icon_species = "<i title=\"Species\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    var icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    var icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    var icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    var icon_add = "<div id=\"add_remove_button\" style=\"padding:0;display:inline-block\"><i onclick=\"addVillager('" + id + "',document.getElementById('list_select').value);\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></i></div>";
    var br = "<br>";
    
    // In case of 'wip.jpg'
    if (head == "wip.jpg") {
        var block_head = "<img title=\"Image not available (yet)\" src=\"villager_heads/" + head + "\" class=\"profile-image\">" + "<div class=\"profile\">";
    }
    else {
        var block_head = "<img title=\"" + name + "\" src=\"villager_heads/" + head + "\" class=\"profile-image\">" + "<div class=\"profile\">";
    }
    
    // Assemble all blocks:
    block = "<div class=\"menu\"><select id=\"list_select\" onchange=\"updateAddVillagerButton();\"></select> " + icon_add + "</div>" +
        block_head + 
        icon_name + name + br +
        icon_species + species + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br +
        icon_wiki + icon_store + "</div>";
    // Display block
    document.getElementById("info").innerHTML = block;
    updateListSelect(); // Update list select
}

// Update the select for selecting a list
function updateListSelect() {
    // Create select options block:
    var options = "";
    for (var l in lists) {
        if (lists[l].id == currentListSelect) {
            options += "<option value=\"" + lists[l].id + "\"selected>" + lists[l].title + "</option>";
        }
        else {
            options += "<option value=\"" + lists[l].id + "\">" + lists[l].title + "</option>";
        }
    }
    document.getElementById("list_select").innerHTML = options;
    updateAddVillagerButton();
}
// Update the button for adding a villager
function updateAddVillagerButton() {
    // Remove button:
    if (villagerInList(currentProfile, document.getElementById("list_select").value)) {
        block = "<i onclick=\"removeVillager('" + currentProfile + "',document.getElementById('list_select').value);\" title=\"Remove from list\" class=\"clickable fa fa-minus\" aria-hidden=\"true\"></i>";
        document.getElementById("add_remove_button").innerHTML = block;
    }
    // Add button:
    else {
        block = "<i onclick=\"addVillager('" + currentProfile + "',document.getElementById('list_select').value);\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></i>";
        document.getElementById("add_remove_button").innerHTML = block;
    }
}
// Check if villager is already in list
function villagerInList(name, id) {
    for (l in lists) {
        if (lists[l].id == id) {
            for (m in lists[l].members) {
                if (lists[l].members[m] == name) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Execute a search from the search bar
function search(query) {
    // In case of empty query:
    if (query == "") {
        viewResults(villagers); // Display all villagers
        return;
    }
    
    query = query.toLowerCase(); // Lowercase
    var results = []; // Create list
    
    // Search by Name:
    for (v in villagers) {
        if (villagers[v].name.toLowerCase().includes(query)) {
            results.push(villagers[v]);
        }
    }
    // Search by Personality:
    for (v in villagers) {
        if (villagers[v].personality.toLowerCase().includes(query)) {
            results.push(villagers[v]);
        }
    }
    // Search by Species:
    for (v in villagers) {
        if (villagers[v].species.toLowerCase().includes(query)) {
            results.push(villagers[v]);
        }
    }
    
    viewResults(results); // Display results
}

// Add villager to list
function addVillager(name, id) {
    currentListSelect = document.getElementById("list_select").value;
    
    // In case of an empty name:
    if (name == "") {
        return;
    }
    
    // Go through list and find:
    for (l in lists) {
        // Add villager to members:
        if (lists[l].id == id) {
            lists[l].members.push(name);
            lists[l].members.sort(); // Alphabetize!
        }
    }
    viewLists(); // Refresh view
    updateListSelect(); // Update list select
}
// Remove villager from list
function removeVillager(name, id) {
    currentListSelect = document.getElementById("list_select").value;
    
    tempList = []; // Keep a temporary array
    // Add all lists:
    for (l in lists) {
        if (lists[l].id == id) {
            // Keep a temporary list:
            temp = {
                title: lists[l].title,
                id: lists[l].id,
                members: []
            };
            // Add all members except for the one removed:
            for (m in lists[l].members) {
                if (lists[l].members[m] != name) {
                    temp.members.push(lists[l].members[m]);
                }
            }
            tempList.push(temp);
        }
        else {
            tempList.push(lists[l]);
        }
    }
    lists = tempList; // Update lists
    viewLists(); // Refresh view
    updateListSelect(); // Update list select
}

// Adding a new list
function newList() {
    idCount++; // Increment global count
    localStorage.idCount = idCount; // Update local storage
    // Create new list:
    list = {
        title : "New List",
        id : idCount,
        members : []
    };
    lists.push(list); // Add to lists
    viewLists(); // Refresh view
    renameList(idCount); // TODO: Initiate rename of list
    updateListSelect(); // Update list select
}
// Removing a list
function deleteList(id) {
    tempList = []; // Keep a temporary array
    // Add all lists except for the one removed:
    for (l in lists) {
        if (lists[l].id != id) {
            tempList.push(lists[l]);
        }
        else {
            // Ask for confirmation:
            var confirmDelete = confirm("Are you sure you want to delete \"" + lists[l].title + "\"?");
            if (!confirmDelete) {
                return;
            }
        }
    }
    // Update lists
    lists = tempList;
    viewLists(); // Refresh view
    updateListSelect(); // Update list select
}

// Renaming a list
function renameList(id) {
    viewLists_Rename(id);
}
// Display lists with renaming input for given id
function viewLists_Rename(id) {
    document.getElementById("lists").innerHTML = ""; // Clear list area
    
    // Create html block:
    var block = "<div>";
    for (var l in lists) {
        // Rename view:
        if (lists[l].id == id) {
            block += "<input onchange=\"applyTitle(" + lists[l].id + ", document.getElementById('rename_bar').value);\" id=\"rename_bar\" type=\"text\" value=\"" + lists[l].title + "\" maxlength=\"20\"></input>" +
                "<i onclick=\"applyTitle(" + lists[l].id + ", document.getElementById('rename_bar').value);\" title=\"Edit name\" class=\"clickable fa fa-check\" aria-hidden=\"true\"></i><div style=\"padding-bottom:0;padding-top:0;\">";
            for (var member in lists[l].members) {
                trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
                block += "<img onclick=\"loadProfile('" + lists[l].members[member] + "');\" title=\"" + trimmedName + "\" src=\"villager_icons/" + lists[l].members[member] + ".gif\">";
            }
            block += "</div>";
        }
        // Regular view:
        else {
            block += "<div class=\"list\">" + lists[l].title + "</div>" +
                "<i onclick=\"deleteList(" + lists[l].id + ");\" title=\"Delete list\" class=\"clickable fa fa-trash\" aria-hidden=\"true\"></i>" +
                "<i onclick=\"renameList(" + lists[l].id + ");\" title=\"Edit name\" class=\"clickable fa fa-pencil\" aria-hidden=\"true\"></i><div style=\"padding-bottom:0;padding-top:0;\">";
            for (var member in lists[l].members) {
                trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
                block += "<img onclick=\"loadProfile('" + lists[l].members[member] + "');\" title=\"" + trimmedName + "\" src=\"villager_icons/" + lists[l].members[member] + ".gif\">";
            }
            block += "</div>";
        }
    }
    block += "</div>";
    // Display block
    document.getElementById("lists").innerHTML = block;
    // Focus rename bar & select all text:
    document.getElementById("rename_bar").focus();
    document.getElementById("rename_bar").select();
}
// Apply new title to list
function applyTitle(id,newTitle) {
    // In case of an empty name:
    if (newTitle == "") {
        viewLists();
        return;
    }
    
    // Go through list and find:
    for (l in lists) {
        // Replace title with new title:
        if (lists[l].id == id) {
            lists[l].title = newTitle;
        }
    }
    viewLists(); // Refresh view
    updateListSelect(); // Update list select
}

// Find villager in json list
function getVillager(name) {
    for (v in villagers) {
        if (villagers[v].id == name) {
            return villagers[v];
        }
    }
    return null;
}

// Trim '(2)' from name for duplicate names
function trimName(name) {
    if (name.includes("(2)")) {
        return name.replace(" (2)", "");
    }
    return name;
}

// Show loading icon in search bar
function searchbarLoading() {
    document.getElementById("search_results").innerHTML = "<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i>";
}

// Clear everything
function clearAll() {
    var confirmClear = confirm("Are you sure you want to clear all lists?");
    if (confirmClear) {
        lists = [];
        idCount = -1;
        //localStorage.lists = JSON.stringify(lists);
        localStorage.idCount = idCount;
    }
    viewLists();
}

// Go to viewer
function openViewer() {
    window.location.href = "viewer";
}

// on page load:
function init() {
    viewResults(villagers);
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
init();