/*
<div onclick="loadProfile('scoot')" class="result">
    <img style="float: left" src="villager_icons/scoot.gif"><div >scoot</div>
</div><br>
*/
function viewResults(resultList) {                
    document.getElementById("search_results").innerHTML = "";
    
    for (var v in resultList) {
        trimmedName = trimName(resultList[v].name);
        
        block = "<div onclick=\"loadProfile('" + resultList[v].name + "')\" class=\"result\">" +
        "<img style=\"float:left\" src=\"villager_icons/" + resultList[v].name + ".gif\">" +
        "<div>" + trimmedName + "</div>" +
        "</div><br>";
        document.getElementById("search_results").innerHTML += block;
    }
}

/*
<i onclick="window.open('http://animalcrossing.wikia.com/wiki/Scoot','_blank');" title="Open Wiki page" class="clickable fa fa-wikipedia-w" style="float:right;" aria-hidden="true"></i>
<img src="villager_heads/wip.jpg" class="profile-image">
<div class="profile">
    <i title="Name" class="fa fa-user" aria-hidden="true"></i>Scoot<br>
    <i title="Personality" class="fa fa-heart" aria-hidden="true"></i>Jock<br>
    <i title="Favorite Coffee" class="fa fa-coffee" aria-hidden="true"></i>Mocha, Regular Milk, 2 Sugars<br>
    <i title="Birthday" class="fa fa-birthday-cake" aria-hidden="true"></i>June 13<br><br>
    <select>
        <option>Favorites</option>
        <option>Hyrule</option>
    </select>
    <i title="Add to list" class="clickable fa fa-plus" aria-hidden="true"></i>
</div>
*/
function loadProfile(name) {
    // TODO find in list
    //name = "Scoot";
    villager = getVillager(name);
    trimmedName = trimName(name);
    var personality = villager.personality;
    var coffee = villager.coffee;
    var birthday = villager.birthday;
    
    var icon_wiki = "<i onclick=\"window.open('http://animalcrossing.wikia.com/wiki/" + trimmedName + "','_blank')\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" style=\"float:right;\" aria-hidden=\"true\"></i>";
    var icon_name = "<i title=\"Name\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    var icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    var icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    var icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    var icon_add = "<i onclick=\"addVillager(\"" + name + "\");\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></i>";
    var options = "<option>Favorites</option><option>Hyrule</option>"; // TODO
    var br = "<br>";
    
    block = icon_wiki + "<img src=\"villager_heads/wip.jpg\" class=\"profile-image\">" + "<div class=\"profile\">" +
        icon_name + trimmedName + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br + br +
        "<select>" + options + "</select> " +
        icon_add + "</div>";
    
    document.getElementById("info").innerHTML = block;
}

function getVillager(name) {
    for (v in villagers) {
        if (villagers[v].name == name) {
            return villagers[v];
        }
    }
    return null;
}

function search(query) {    
    if (query == "") {
        viewResults(villagers);
        return;
    }
    
    query = query.toLowerCase();
    var results = [];
    
    // Name
    for (v in villagers) {
        if (villagers[v].name.toLowerCase().includes(query)) {
            results.push(villagers[v]);
        }
    }
    // Personality
    for (v in villagers) {
        if (villagers[v].personality.toLowerCase().includes(query)) {
            results.push(villagers[v]);
        }
    }
    // Species
    for (v in villagers) {
        if (villagers[v].species.toLowerCase().includes(query)) {
            results.push(villagers[v]);
        }
    }
    
    viewResults(results);
}

function trimName(name) {
    if (name.includes("(2)")) {
        return name.replace(" (2)", "");
    }
    return name;
}

function searchbarLoading() {
    document.getElementById("search_results").innerHTML = "<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i>";
}

viewResults(villagers);