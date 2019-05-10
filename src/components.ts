import { addVillager, birthdayIsToday, currentProfile, getListSelectValue, listsAreEmpty, loadProfile, removeVillager } from './main';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

export function aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
    let dropdownOption: HTMLOptionElement = document.createElement('option');
    dropdownOption.innerHTML = list.title;
    dropdownOption.value = list.id.toString();
    dropdownOption.selected = isSelected;
    return dropdownOption;
}

export function anAddVillagerToListButton(): HTMLButtonElement {
    const isDisabled = listsAreEmpty();

    let addVillagerToListButton: HTMLButtonElement = document.createElement('button');
    addVillagerToListButton.onclick = () => {
        addVillager(currentProfile, getListSelectValue());
    }
    addVillagerToListButton.title = 'Add to list';
    addVillagerToListButton.setAttribute('aria-hidden', 'true');

    addVillagerToListButton.className = isDisabled ? 'disabled fa fa-plus' : 'clickable fa fa-plus';
    addVillagerToListButton.disabled = isDisabled;

    return addVillagerToListButton;
}

export function aRemoveVillagerFromListButton(): HTMLButtonElement {
    let removeVillagerFromListButton: HTMLButtonElement = document.createElement('button');
    removeVillagerFromListButton.onclick = () => {
        removeVillager(currentProfile, getListSelectValue());
    };
    removeVillagerFromListButton.title = 'Remove from list';
    removeVillagerFromListButton.className = 'clickable fa fa-minus';
    removeVillagerFromListButton.setAttribute('aria-hidden', 'true');
    return removeVillagerFromListButton;
}

export function aVillagerSearchResultButton(villager: Villager): HTMLButtonElement {
    let villagersSearchResultButton: HTMLButtonElement = document.createElement('button');
    villagersSearchResultButton.onclick = () => { loadProfile(villager.id); };
    villagersSearchResultButton.className = 'result';
    villagersSearchResultButton.appendChild(aVillagersSearchResultImage(villager));
    villagersSearchResultButton.appendChild(aVillagersSearchResultNameElement());
    return villagersSearchResultButton;

    function aVillagersSearchResultNameElement(): HTMLElement {
        let villagersSearchResultNameElement: HTMLElement = document.createElement('div');
        villagersSearchResultNameElement.innerHTML = villager.name;
        return villagersSearchResultNameElement;
    }
}

export function aVillagersSearchResultImage(villager: Villager): HTMLImageElement {
    let villagersSearchResultImage: HTMLImageElement = document.createElement('img');
    villagersSearchResultImage.alt = villager.name;
    villagersSearchResultImage.style.cssFloat = 'left';
    villagersSearchResultImage.src = `./villager_icons/${villager.id}.gif`;
    return villagersSearchResultImage;
}

export function anAddOrRemoveElement(): HTMLElement {
    let addOrRemoveElement: HTMLElement = document.createElement('div');
    addOrRemoveElement.style.padding = '0';
    addOrRemoveElement.style.display = 'inline-block';
    return addOrRemoveElement;
}

export function aBreakElement(): HTMLElement {
    return document.createElement('br');
}

export function aTextNode(text: string): Text | HTMLSpanElement {
    return text === '' ? anNASpanElement() : document.createTextNode(text);
}

export function anNASpanElement(): HTMLSpanElement {
    let naElement: HTMLSpanElement = document.createElement('span');
    naElement.className = 'na';
    naElement.innerHTML = 'N/A';
    return naElement;
}

export function aBirthdayTextNode(birthday: Date): Text | HTMLSpanElement {
    if (birthdayIsToday(birthday.toString())) {
        let birthdaySpan: HTMLSpanElement = document.createElement('span');
        birthdaySpan.innerHTML = birthday.toString();
        birthdaySpan.className = 'birthday';
        return birthdaySpan;
    } else {
        return aTextNode(birthday.toString());
    }
}

export function aBirthdayButton(villagerName: string): HTMLButtonElement {
    let birthdayEasterEggButton: HTMLButtonElement = document.createElement('button');
    birthdayEasterEggButton.title = `Happy birthday to ${villagerName}!`;
    birthdayEasterEggButton.onclick = () => {
        new Audio('./happybirthday.mp3').play();
    };
    birthdayEasterEggButton.style.color = 'hotpink';
    birthdayEasterEggButton.className = 'clickable fa fa-birthday-cake';
    birthdayEasterEggButton.setAttribute('aria-hidden', 'true');
    return birthdayEasterEggButton;
}

export function aWikiIconButton(wikiLink: string): HTMLButtonElement {
    let wikiIconButton: HTMLButtonElement = document.createElement('button');
    wikiIconButton.onclick = () => { window.open(wikiLink, '_blank'); }
    wikiIconButton.title = 'Open Wiki page';
    wikiIconButton.className = 'clickable fa fa-wikipedia-w';
    wikiIconButton.setAttribute('aria-hidden', 'true');
    return wikiIconButton;
}

export function aStoreIconButton(storeLink: string): HTMLButtonElement {
    let storeIconButton: HTMLButtonElement = document.createElement('button');
    storeIconButton.onclick = () => { window.open(storeLink, '_blank'); }
    storeIconButton.title = 'Buy this art!';
    storeIconButton.className = 'clickable fa fa-shopping-bag';
    storeIconButton.setAttribute('aria-hidden', 'true');
    return storeIconButton;
}

export function aNameIcon(): HTMLElement {
    let nameIcon: HTMLElement = document.createElement('i');
    nameIcon.title = 'Name';
    nameIcon.className = 'fa fa-tag';
    nameIcon.setAttribute('aria-hidden', 'true');
    return nameIcon;
}

export function aSpeciesIcon(): HTMLElement {
    let speciesIcon: HTMLElement = document.createElement('i');
    speciesIcon.title = 'Species';
    speciesIcon.className = 'fa fa-user';
    speciesIcon.setAttribute('aria-hidden', 'true');
    return speciesIcon;
}

export function aPersonalityIcon(): HTMLElement {
    let personalityIcon: HTMLElement = document.createElement('i');
    personalityIcon.title = 'Personality';
    personalityIcon.className = 'fa fa-heart';
    personalityIcon.setAttribute('aria-hidden', 'true');
    return personalityIcon;
}

export function aCoffeeIcon(): HTMLElement {
    let coffeeIcon: HTMLElement = document.createElement('i');
    coffeeIcon.title = 'Favourite coffee';
    coffeeIcon.className = 'fa fa-coffee';
    coffeeIcon.setAttribute('aria-hidden', 'true');
    return coffeeIcon;
}

export function aBirthdayIcon(villager: Villager): HTMLButtonElement | HTMLElement {
    if (birthdayIsToday(villager.birthday.toString())) {
        return aBirthdayButton(villager.name);
    } else {
        let birthdayIcon: HTMLElement = document.createElement('i');
        birthdayIcon.title = 'Birthday';
        birthdayIcon.className = 'fa fa-birthday-cake';
        birthdayIcon.setAttribute('aria-hidden', 'true');
        return birthdayIcon;
    }
}