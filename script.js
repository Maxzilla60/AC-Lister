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

function viewLists() {
    document.getElementById("lists").innerHTML = "";
    
    var block = "<div class=\"lists\">";
    for (var list in lists) {
        block += "<div style=\"display:inline-block;\">" + lists[list].title + "</div>" +
            "<i onclick=\"deleteList(" + lists[list].id + ")\"  title=\"Delete list\" class=\"clickable fa fa-minus\" aria-hidden=\"true\"></i>" +
            "<i onclick=\"renameList(" + lists[list].id + ")\"  title=\"Edit name\" class=\"clickable fa fa-pencil\" aria-hidden=\"true\"></i><div style=\"padding-bottom:0;padding-top:0;\">";
        for (var member in lists[list].members) {
            trimmedName = trimName(lists[list].members[member])
            block += "<img onclick=\"loadProfile('" + lists[list].members[member] + "')\" title=\"" + trimmedName + "\" src=\"villager_icons/" + lists[list].members[member] + ".gif\">";
        }
        block += "</div>";
    }
    block += "</div>";
    
    document.getElementById("lists").innerHTML = block;
}

/*
<div class="list">
    <div style="display:inline-block;">Favorites</div>
    <i onclick="deleteList(0)" title="Delete list" class="clickable fa fa-minus" aria-hidden="true"></i><i title="Edit name" class="clickable fa fa-pencil" aria-hidden="true"></i>
    <div>
        <img onclick="removeVillager(0,'Scoot')" title="Scoot" src="villager_icons/Scoot.gif">
        <img onclick="removeVillager(0,'Scoot')" title="Scoot" src="villager_icons/Scoot.gif">
        <img onclick="removeVillager(0,'Scoot')" title="Scoot" src="villager_icons/Scoot.gif">
    </div>
</div>
*/

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
    villager = getVillager(name); // Get villager json
    trimmedName = trimName(name); // Trim name for duplicate names
    // Get values from json:
    var personality = villager.personality;
    var coffee = villager.coffee;
    var birthday = villager.birthday;
    
    // Create Font Awesome blocks:
    var icon_wiki = "<i onclick=\"window.open('http://animalcrossing.wikia.com/wiki/" + trimmedName + "','_blank')\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" style=\"float:right;\" aria-hidden=\"true\"></i>";
    var icon_name = "<i title=\"Name\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    var icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    var icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    var icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    var icon_add = "<i onclick=\"addVillager('" + name + "');\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></i>";
    // Other blocks:
    var options = "<option>Favorites</option><option>Hyrule</option>"; // TODO
    var br = "<br>";
    
    // Assemble all blocks:
    block = icon_wiki + "<img src=\"villager_heads/wip.jpg\" class=\"profile-image\">" + "<div class=\"profile\">" +
        icon_name + trimmedName + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br + br +
        "<select>" + options + "</select> " +
        icon_add + "</div>";
    // Display block
    document.getElementById("info").innerHTML = block;
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