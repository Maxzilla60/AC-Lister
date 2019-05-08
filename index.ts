import { Villager } from './models/villager.model';
import villagersJson from './villagers.json';

let villagers: Villager[] = villagersJson;

// villagers = villagers.map(v => v.birthday);
// villagers = villagers.filter(v => v.birthday === '');
// villagers = villagers.map(v => v.split(' ')[0]);
// villagers = villagers.map((v: Villager) => v.species);
villagers = [...new Set(villagers)];
villagers = villagers.sort();

function component(villagers: Villager[]) {
    const element = document.createElement('div');
    element.innerHTML = villagers
        .map(v => v.name)
        .join('<br/>');
    return element;
}

export function fart() {
    console.log('💨');
}

document.body.appendChild(component(villagers));
console.log(villagers);