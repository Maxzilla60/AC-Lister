var idCount = 1;
var currentProfile = "";
var lists = [
    {
        title: "Favorites",
        id: 0,
        members: [
            "Scoot",
            "Simon",
            "Petunia (2)"
        ]
    },
    {
        title: "Hyrule",
        id: 1,
        members: [
            "Peanut",
            "Goose"
        ]
    }
];

// Display lists in list area
function viewLists() {
    document.getElementById("lists").innerHTML = ""; // Clear list area
    
    // Create html block:
    var block = "<div>";
    for (var l in lists) {
        block += "<div class=\"list\">" + lists[l].title + "</div>" +
            "<i onclick=\"deleteList(" + lists[l].id + ")\"  title=\"Delete list\" class=\"clickable fa fa-minus\" aria-hidden=\"true\"></i>" +
            "<i onclick=\"renameList(" + lists[l].id + ")\"  title=\"Edit name\" class=\"clickable fa fa-pencil\" aria-hidden=\"true\"></i><div style=\"padding-bottom:0;padding-top:0;\">";
        for (var member in lists[l].members) {
            trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
            block += "<img onclick=\"loadProfile('" + lists[l].members[member] + "')\" title=\"" + trimmedName + "\" src=\"villager_icons/" + lists[l].members[member] + ".gif\">";
        }
        block += "</div>";
    }
    block += "</div>";
    // Display block
    document.getElementById("lists").innerHTML = block;
}

// Display search results in results bar
function viewResults(resultList) {
    document.getElementById("search_results").innerHTML = ""; // Clear results bar
    
    for (var v in resultList) {
        trimmedName = trimName(resultList[v].name); // Trim name for duplicate names
        
        // Create html block:
        var block = "<div onclick=\"loadProfile('" + resultList[v].name + "')\" class=\"result\">" +
        "<img style=\"float:left\" src=\"villager_icons/" + resultList[v].name + ".gif\">" +
        "<div>" + trimmedName + "</div>" +
        "</div><br>";
        // Display block
        document.getElementById("search_results").innerHTML += block;
    }
}

// Display villager profile
function loadProfile(name) {
    currentProfile = name;
    var villager = getVillager(name); // Get villager json
    var trimmedName = trimName(name); // Trim name for duplicate names
    // Get values from json:
    var species = villager.species;
    var personality = villager.personality;
    var coffee = villager.coffee;
    var birthday = villager.birthday;
    
    // Create Font Awesome blocks:
    var icon_wiki = "<i onclick=\"window.open('http://animalcrossing.wikia.com/wiki/" + trimmedName + "','_blank')\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" aria-hidden=\"true\"></i>";
    var icon_name = "<i title=\"Name\" class=\"fa fa-tag\" aria-hidden=\"true\"></i>";
    var icon_species = "<i title=\"Species\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    var icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    var icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    var icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    var icon_add = "<div id=\"add_remove_button\" style=\"padding:0;display:inline-block\"><i onclick=\"addVillager('" + name + "',document.getElementById('list_select').value);\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></i></div>";
    var br = "<br>";
    
    // Assemble all blocks:
    block = "<div class=\"menu\"><select id=\"list_select\" onchange=\"updateAddVillagerButton();\"></select> " + icon_add + "</div>" +
        "<img src=\"villager_heads/wip.jpg\" class=\"profile-image\">" + "<div class=\"profile\">" +
        icon_name + trimmedName + br +
        icon_species + species + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br +
        icon_wiki + "</div>";
    // Display block
    document.getElementById("info").innerHTML = block;
    updateListSelect(); // Update list select
}

// Update the select for selecting a list
function updateListSelect() {
    // Create select options block:
    var options = "";
    for (var l in lists) {
        options += "<option value=\"" + lists[l].id + "\">" + lists[l].title + "</option>";
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
    // In case of an empty name:
    if (name == "") {
        return;
    }
    
    // Go through list and find:
    for (l in lists) {
        // Add villager to members:
        if (lists[l].id == id) {
            lists[l].members.push(name);  
        }
    }
    viewLists(); // Refresh view
    updateListSelect(); // Update list select
}
// Remove villager from list
function removeVillager(name, id) {
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
            block += "<input onchange=\"applyTitle(" + lists[l].id + ", document.getElementById('rename_bar').value);\" id=\"rename_bar\" type=\"text\" value=\"" + lists[l].title + "\"></input>" +
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
                "<i onclick=\"deleteList(" + lists[l].id + ");\"  title=\"Delete list\" class=\"clickable fa fa-minus\" aria-hidden=\"true\"></i>" +
                "<i onclick=\"renameList(" + lists[l].id + ");\"  title=\"Edit name\" class=\"clickable fa fa-pencil\" aria-hidden=\"true\"></i><div style=\"padding-bottom:0;padding-top:0;\">";
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
        if (villagers[v].name == name) {
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

// on page load:
viewResults(villagers);
viewLists();