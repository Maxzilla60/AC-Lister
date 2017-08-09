lists = [];

// Display lists in list area
function viewLists() {
    document.getElementById("lists").innerHTML = ""; // Clear list area
    localStorage.lists = JSON.stringify(lists); // Update local storage
    var block = "";
    
    if (lists.length !== 0) {
        // Create html block:
        block = "<div>";
        for (var l in lists) {
            block += "<div class=\"list\" style=\"\">" + lists[l].title + "</div>" +
                "<div style=\"padding-bottom:0;padding-top:0;\">";
            for (var member in lists[l].members) {
                trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
                block += "<img title=\"" + trimmedName + "\" src=\"villager_icons/" + lists[l].members[member] + ".gif\">";
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

// Return to main page
function closeViewer() {
    window.location.href = "/ac-lister/";
}

// Trim '(2)' from name for duplicate names
function trimName(name) {
    if (name.includes("(2)")) {
        return name.replace(" (2)", "");
    }
    return name;
}

// on page load:
function init() {
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