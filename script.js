/*
<div onclick="loadProfile('scoot')" class="result">
    <img style="float: left" src="villager_icons/scoot.gif"><div >scoot</div>
</div><br>
*/
function generateResults(resultList) {                
    document.getElementById("search_results").innerHTML = "";
    for (var v in resultList) {
        block = "<div onclick=\"loadProfile('" + resultList[v].name + "')\" class=\"result\">" +
        "<img style=\"float:left\" src=\"villager_icons/" + resultList[v].name + ".gif\">" +
        "<div>" + resultList[v].name + "</div>" +
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
    name = "Scoot";
    var personality = "Jock";
    var coffee = "Mocha, Regular Milk, 2 Sugars";
    var birthday = "June 13";
    
    var icon_wiki = "<i onclick=\"window.open('http://animalcrossing.wikia.com/wiki/" + name + "','_blank')\" title=\"Open Wiki page\" class=\"clickable fa fa-wikipedia-w\" style=\"float:right;\" aria-hidden=\"true\"></i>";
    var icon_name = "<i title=\"Name\" class=\"fa fa-user\" aria-hidden=\"true\"></i>";
    var icon_personality = "<i title=\"Personality\" class=\"fa fa-heart\" aria-hidden=\"true\"></i>";
    var icon_coffee = "<i title=\"Favorite coffee\" class=\"fa fa-coffee\" aria-hidden=\"true\"></i>";
    var icon_birthday = "<i title=\"Birthday\" class=\"fa fa-birthday-cake\" aria-hidden=\"true\"></i>";
    var icon_add = "<i onclick=\"addVillager();\" title=\"Add to list\" class=\"clickable fa fa-plus\" aria-hidden=\"true\"></i>";
    var options = "<option>Favorites</option><option>Hyrule</option>"; // TODO
    var br = "<br>";
    
    block = icon_wiki + "<img src=\"villager_heads/wip.jpg\" class=\"profile-image\">" + "<div class=\"profile\">" +
        icon_name + name + br +
        icon_personality + personality + br +
        icon_coffee + coffee + br +
        icon_birthday + birthday + br + br +
        "<select>" + options + "</select> " +
        icon_add + "</div>";
    
    document.getElementById("info").innerHTML = block;
}

//---

function test_generateResults() {
    var name = "Scoot";
    document.getElementById("search_results").innerHTML = "";
    for (var i = 0 ; i < 15 ; i++) {
        block = "<div onclick=\"loadProfile('" + name + "')\" class=\"result\">" +
        "<img style=\"float:left\" src=\"villager_icons/" + name + ".gif\">" +
        "<div>" + name + "</div>" +
        "</div><br>";
        document.getElementById("search_results").innerHTML += block;
    }
}
test_generateResults();