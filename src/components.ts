import { addVillager, applyTitle, birthdayIsToday, currentProfile, deleteList, getListSelectValue, listsAreEmpty, loadProfile, removeVillager, renameList, updateListSelect } from './main';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

function getRenameListTitleValue(): string {
    return (<HTMLInputElement>$('rename_bar')).value;
}

// Trim '(2)' from name for duplicate names
function trimName(name: string): string {
    return name.replace(" (2)", "");
}

export function aDivider(): HTMLElement {
    var divider: HTMLElement = document.createElement('div');
    divider.style.paddingBottom = '0';
    divider.style.paddingTop = '0';
    return divider;
}

export function aListTitleElement(list: VillagerList): HTMLButtonElement {
    let listTitleElement: HTMLButtonElement = document.createElement('button');
    listTitleElement.onclick = () => { updateListSelect(list.id); };
    listTitleElement.innerHTML = list.title;
    listTitleElement.className = 'clickable list';
    return listTitleElement;
}

export function aListDeleteButton(list: VillagerList): HTMLButtonElement {
    let deleteButtonElement: HTMLButtonElement = document.createElement('button');
    deleteButtonElement.onclick = () => { deleteList(list.id); }
    deleteButtonElement.title = 'Delete list';
    deleteButtonElement.className = 'clickable fa fa-trash';
    deleteButtonElement.setAttribute('aria-hidden', 'true');
    return deleteButtonElement;
}

export function aListRenameButton(list: VillagerList): HTMLButtonElement {
    let listRenameButtonElement: HTMLButtonElement = document.createElement('button');
    listRenameButtonElement.onclick = () => { renameList(list.id); }
    listRenameButtonElement.title = 'Edit list title';
    listRenameButtonElement.className = 'clickable fa fa-pencil';
    listRenameButtonElement.setAttribute('aria-hidden', 'true');
    return listRenameButtonElement;
}

export function aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
    let dropdownOption: HTMLOptionElement = document.createElement('option');
    dropdownOption.innerHTML = list.title;
    dropdownOption.value = list.id.toString();
    dropdownOption.selected = isSelected;
    return dropdownOption;
}

export function aListTitleInputElement(list: VillagerList): HTMLInputElement {
    let listTitleInputElement: HTMLInputElement = document.createElement('input');
    listTitleInputElement.onchange = () => {
        applyTitle(list.id, getRenameListTitleValue());
    }
    listTitleInputElement.id = 'rename_bar';
    listTitleInputElement.type = 'text';
    listTitleInputElement.value = list.title;
    listTitleInputElement.maxLength = 30;
    return listTitleInputElement;
}

export function aListRenameConfirmButton(list: VillagerList): HTMLButtonElement {
    let listRenameButtonElement: HTMLButtonElement = document.createElement('button');
    listRenameButtonElement.onclick = () => {
        applyTitle(list.id, getRenameListTitleValue());
    }
    listRenameButtonElement.title = 'Edit name';
    listRenameButtonElement.className = 'clickable fa fa-check';
    listRenameButtonElement.setAttribute('aria-hidden', 'true');
    return listRenameButtonElement;
}

export function anEmptyListInfoElement(): HTMLElement {
    let emptyListInfoElement = document.createElement('div');
    emptyListInfoElement.style.paddingLeft = '15px';
    emptyListInfoElement.style.color = 'orange';
    emptyListInfoElement.innerHTML = 'Click<i onclick="index.newList();" title="Add list" class="clickable fa fa-plus" aria-hidden="true" style="margin-left:3px;margin-right:3px;"></i>to make a new list!';
    return emptyListInfoElement;
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

export function aVillagersIconsSection(list: VillagerList): HTMLElement {
    let villagerIconsSection = aDivider();
    for (let villager of list.members) {
        villagerIconsSection.appendChild(aVillagerListIcon(villager, list));
    }
    return villagerIconsSection;
}

export function aVillagerListIcon(villager: string, list: VillagerList): HTMLImageElement {
    let villagerListIcon: HTMLImageElement = document.createElement('img');
    villagerListIcon.onclick = () => {
        loadProfile(villager);
        updateListSelect(list.id);
    };
    villagerListIcon.title = trimName(villager);
    villagerListIcon.src = `./villager_icons/${villager}.gif`;
    return villagerListIcon;
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