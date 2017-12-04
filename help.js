// Percentage of Villager heads done (run in browser console)
var i = 0;
for (v in villagers) {
	if (villagers[v].head != "wip.jpg") i++;
}
Math.floor((i/villagers.length)*100) + "%"