import { addVillager, aProfileIsSelected, currentListSelect, currentProfile, getListSelectValue, lists, removeVillager } from './main';
import { Personality } from './models/personality.enum';
import { Species } from './models/species.enum';
import { Villager } from './models/villager.model';
import { VillagerList } from './models/villagerlist.model';
import { aBreakElement, birthdayIsToday, clearElement, listsAreEmpty, villagerHasProfileImage, villagerIsInList } from './util';

function $(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

export default class ProfileView {
    public static updateView(villager: Villager): void {
        clearElement($('profile'));

        this.appendVillagerInfo(villager);
        this.appendWikiAndStoreButtons(villager);

        this.updateListSelect();
        this.updateProfileImage(villager);

        this.fadeTransition();
    }

    public static updateListSelect(selectedListId: number = currentListSelect): void {
        if (!aProfileIsSelected()) { return; }

        clearElement($('list_select'));

        (<HTMLSelectElement>$('list_select')).disabled = listsAreEmpty();
        if (!listsAreEmpty()) {
            for (let list of lists) {
                $('list_select').appendChild(this.aListDropdownOption(list, list.id == selectedListId));
            }
        }

        this.updateAddVillagerButton();
    }

    private static appendVillagerInfo(villager: Villager) {
        this.appendVillagerNameInfo(villager.name);
        this.appendABreakElement();
        this.appendVillagerSpeciesInfo(villager.species);
        this.appendABreakElement();
        this.appendVillagerPersonalityInfo(villager.personality);
        this.appendABreakElement();
        this.appendVillagerCoffeeInfo(villager.coffee);
        this.appendABreakElement();
        this.appendVillagerBirthdayInfo(villager);
    }

    private static appendWikiAndStoreButtons(villager: Villager) {
        $('profile').appendChild(this.anAddOrRemoveElement());
        this.appendABreakElement();
        $('profile').appendChild(this.aWikiIconButton(villager.wiki));
        $('profile').appendChild(this.aStoreIconButton(villager.store));
    }

    private static updateProfileImage(villager: Villager): void {
        let profileImageElement: HTMLImageElement = <HTMLImageElement>$('profile-image');
        profileImageElement.alt = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.title = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.src = `./villager_heads/${villager.head}`;
    }

    private static updateAddVillagerButton(): void {
        clearElement($('add_remove_button'));
        if (villagerIsInList(currentProfile, getListSelectValue())) {
            $('add_remove_button').appendChild(this.aRemoveVillagerFromListButton());
        } else {
            $('add_remove_button').appendChild(this.anAddVillagerToListButton());
        }
    }

    private static appendABreakElement(): void {
        $('profile').appendChild(aBreakElement());
    }

    private static appendATextNode(text: string): void {
        $('profile').appendChild(this.aTextNode(text));
    }

    private static appendVillagerNameInfo(villagerName: string): void {
        $('profile').appendChild(this.aNameIcon());
        this.appendATextNode(villagerName);
    }
    private static appendVillagerSpeciesInfo(villagerSpecies: Species): void {
        $('profile').appendChild(this.aSpeciesIcon());
        this.appendATextNode(villagerSpecies);
    }
    private static appendVillagerPersonalityInfo(villagerPersonality: Personality): void {
        $('profile').appendChild(this.aPersonalityIcon());
        this.appendATextNode(villagerPersonality);
    }
    private static appendVillagerCoffeeInfo(villagerCoffee: string): void {
        $('profile').appendChild(this.aCoffeeIcon());
        this.appendATextNode(villagerCoffee);
    }
    private static appendVillagerBirthdayInfo(villager: Villager) {
        $('profile').appendChild(this.aBirthdayIcon(villager));
        $('profile').appendChild(this.aBirthdayTextNode(villager.birthday));
    }

    private static anAddOrRemoveElement(): HTMLElement {
        let addOrRemoveElement: HTMLElement = document.createElement('div');
        addOrRemoveElement.style.padding = '0';
        addOrRemoveElement.style.display = 'inline-block';
        return addOrRemoveElement;
    }

    private static aWikiIconButton(wikiLink: string): HTMLButtonElement {
        let wikiIconButton: HTMLButtonElement = document.createElement('button');
        wikiIconButton.onclick = () => { window.open(wikiLink, '_blank'); }
        wikiIconButton.title = 'Open Wiki page';
        wikiIconButton.className = 'clickable fa fa-wikipedia-w';
        wikiIconButton.setAttribute('aria-hidden', 'true');
        return wikiIconButton;
    }

    private static aStoreIconButton(storeLink: string): HTMLButtonElement {
        let storeIconButton: HTMLButtonElement = document.createElement('button');
        storeIconButton.onclick = () => { window.open(storeLink, '_blank'); }
        storeIconButton.title = 'Buy this art!';
        storeIconButton.className = 'clickable fa fa-shopping-bag';
        storeIconButton.setAttribute('aria-hidden', 'true');
        return storeIconButton;
    }

    private static aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
        let dropdownOption: HTMLOptionElement = document.createElement('option');
        dropdownOption.innerHTML = list.title;
        dropdownOption.value = list.id.toString();
        dropdownOption.selected = isSelected;
        return dropdownOption;
    }

    private static aTextNode(text: string): Text | HTMLSpanElement {
        return text === '' ? this.anNASpanElement() : document.createTextNode(text);
    }

    private static aNameIcon(): HTMLElement {
        let nameIcon: HTMLElement = document.createElement('i');
        nameIcon.title = 'Name';
        nameIcon.className = 'fa fa-tag';
        nameIcon.setAttribute('aria-hidden', 'true');
        return nameIcon;
    }

    private static aSpeciesIcon(): HTMLElement {
        let speciesIcon: HTMLElement = document.createElement('i');
        speciesIcon.title = 'Species';
        speciesIcon.className = 'fa fa-user';
        speciesIcon.setAttribute('aria-hidden', 'true');
        return speciesIcon;
    }

    private static aPersonalityIcon(): HTMLElement {
        let personalityIcon: HTMLElement = document.createElement('i');
        personalityIcon.title = 'Personality';
        personalityIcon.className = 'fa fa-heart';
        personalityIcon.setAttribute('aria-hidden', 'true');
        return personalityIcon;
    }

    private static aCoffeeIcon(): HTMLElement {
        let coffeeIcon: HTMLElement = document.createElement('i');
        coffeeIcon.title = 'Favourite coffee';
        coffeeIcon.className = 'fa fa-coffee';
        coffeeIcon.setAttribute('aria-hidden', 'true');
        return coffeeIcon;
    }

    private static aBirthdayIcon(villager: Villager): HTMLButtonElement | HTMLElement {
        if (birthdayIsToday(villager.birthday.toString())) {
            return this.aBirthdayButton(villager.name);
        } else {
            let birthdayIcon: HTMLElement = document.createElement('i');
            birthdayIcon.title = 'Birthday';
            birthdayIcon.className = 'fa fa-birthday-cake';
            birthdayIcon.setAttribute('aria-hidden', 'true');
            return birthdayIcon;
        }
    }

    private static aBirthdayTextNode(birthday: Date): Text | HTMLSpanElement {
        if (birthdayIsToday(birthday.toString())) {
            let birthdaySpan: HTMLSpanElement = document.createElement('span');
            birthdaySpan.innerHTML = birthday.toString();
            birthdaySpan.className = 'birthday';
            return birthdaySpan;
        } else {
            return this.aTextNode(birthday.toString());
        }
    }

    private static aBirthdayButton(villagerName: string): HTMLButtonElement {
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

    private static anAddVillagerToListButton(): HTMLButtonElement {
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

    private static aRemoveVillagerFromListButton(): HTMLButtonElement {
        let removeVillagerFromListButton: HTMLButtonElement = document.createElement('button');
        removeVillagerFromListButton.onclick = () => {
            removeVillager(currentProfile, getListSelectValue());
        };
        removeVillagerFromListButton.title = 'Remove from list';
        removeVillagerFromListButton.className = 'clickable fa fa-minus';
        removeVillagerFromListButton.setAttribute('aria-hidden', 'true');
        return removeVillagerFromListButton;
    }

    private static anNASpanElement(): HTMLSpanElement {
        let naElement: HTMLSpanElement = document.createElement('span');
        naElement.className = 'na';
        naElement.innerHTML = 'N/A';
        return naElement;
    }

    private static fadeTransition() {
        // Transition:
        /* // Hide:
        let results = document.querySelectorAll<HTMLElement>('#info *');
        for (let i = 0; i < results.length; i++) {
            results[i].style.opacity = '0';
        }
        // Show:
        setTimeout(function () {
            let results = document.querySelectorAll<HTMLElement>('#info *');
            for (let i = 0; i < results.length; i++) {
                results[i].style.opacity = '1';
            }
        }, 100); */
    }
}

