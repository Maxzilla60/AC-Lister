const villagersJson = require('./villagers.json');

let villagers = villagersJson;

// villagers = villagers.map(v => v.birthday);
// villagers = villagers.filter(v => v.birthday === '');
// villagers = villagers.map(v => v.split(' ')[0]);
villagers = villagers.map(v => v.personality);
villagers = [...new Set(villagers)];

function component() {
    const element = document.createElement('div');

    element.innerHTML = villagers.join('<br/>');

    return element;
}

export function fart() {
    console.log('💨');
}

document.body.appendChild(component());
console.log(villagers);