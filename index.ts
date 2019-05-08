import villagersJson from './villagers.json';

let villagers = villagersJson;

// villagers = villagers.map(v => v.birthday);
// villagers = villagers.filter(v => v.birthday === '');
// villagers = villagers.map(v => v.split(' ')[0]);
villagers = villagers.map((v: any) => v.species);
villagers = [...new Set(villagers)];
villagers = villagers.sort();

function component(villagers: []) {
    const element = document.createElement('div');

    element.innerHTML = villagers.join('<br/>');

    return element;
}

export function fart() {
    console.log('💨');
}

document.body.appendChild(component(villagers));
console.log(villagers);