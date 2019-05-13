var lists = [];

// Display lists in list area
function viewLists() {
	document.getElementById("viewer_lists").innerHTML = ""; // Clear list area
	var block = "";

	if (lists.length !== 0) {
		// Create html block:
		block = "<div>";
		for (var l in lists) {
			block += "<div class=\"list\" style=\"\">" + lists[l].title + "</div>" +
				"<div style=\"padding-bottom:0;padding-top:0;\">";
			for (var member in lists[l].members) {
				trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
				block += "<img title=\"" + trimmedName + "\" src=\"../villager_icons/" + lists[l].members[member] + ".gif\">";
			}
			block += "</div>";
		}
		block += "</div>";
	}
	// In case of empty list:
	else {
		block = "<div style=\"padding-left:15px;color:orange;\">Click<i onclick=\"closeViewer();\" title=\"Close viewer\" class=\"clickable fa fa-compress\" aria-hidden=\"true\" style=\"margin-left:3px;margin-right:3px;\"></i>and make a list!</div>";
	}

	// Display block
	document.getElementById("viewer_lists").innerHTML = block;
}

// Return to main page
function closeViewer() {
	window.location.href = "/AC-Lister/";
}

// Trim '(2)' from name for duplicate names
function trimName(name) {
	if (name.includes("(2)")) {
		return name.replace(" (2)", "");
	}
	return name;
}

// Open sharable link
function openShare() {
	prompt("Copy the link and share!", "https://maxzilla60.github.io/AC-Lister/viewer?lists=" + encodeURIComponent(JSON.stringify(lists)));
}

// Save as image
function exportImage() {
	// Temporarily hide menu items
	document.getElementsByClassName("menu")[0].style.display = "none";

	// Turn viewer-list-area into canvas and save:
	html2canvas($("#viewer_list_area"), {
		onrendered: function (canvas) {
			canvas.toBlob(function (blob) {
				saveAs(blob, "AnimalCrossing-VillagerLists.png");
			});
		}
	});
	// Display menu again
	document.getElementsByClassName("menu")[0].style.display = "";
}

// Save as text file
function exportText() {
	var text = "";

	for (var l in lists) {
		text += lists[l].title + ":\n";
		for (var member in lists[l].members) {
			trimmedName = trimName(lists[l].members[member]); // Trim name for duplicate names
			text += "\t- " + trimmedName + "\n";
		}
		text += "\n";
	}
	text += "Made with Animal Crossing Villager Lister\n(https://maxzilla60.github.io/AC-Lister/)";

	var blob = new Blob([text], { type: "text/plain;charset-utf-8" });
	saveAs(blob, "AnimalCrossing-VillagerLists.txt");
}

// On page load
function init() {
	// Get share from URL:
	var url = new URL(window.location.href);
	var share = url.searchParams.get("lists");

	// Retrieve lists from URL:
	if (share != null) {
		lists = JSON.parse(decodeURIComponent(share));
	}
	// Retrieve lists from local storage:
	else if (localStorage.lists) {
		lists = JSON.parse(localStorage.lists);
	}
	// Disable buttons when list is empty:
	if (lists.length <= 0) {
		// Image button:
		document.getElementById("image_button").className = "disabled fa fa-camera";
		document.getElementById("image_button").onclick = function () { };
		// Text button:
		document.getElementById("text_button").className = "disabled fa fa-file-text";
		document.getElementById("text_button").onclick = function () { };
		// Share button:
		document.getElementById("share_button").className = "disabled fa fa-share";
		document.getElementById("share_button").onclick = function () { };
	}
	viewLists();
}
init();