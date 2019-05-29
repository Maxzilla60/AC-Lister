import { addVillager, removeVillager } from '../actions';
import ButtonBuilder from '../components/ButtonBuilder';
import DivisionBuilder from '../components/DivisionBuilder';
import IconBuilder from '../components/IconBuilder';
import { Personality } from '../models/personality.enum';
import { Species } from '../models/species.enum';
import { Villager } from '../models/villager.model';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { aBreakElement, birthdayIsToday, clearElement, getElement as $, getListSelectValue, villagerHasProfileImage } from '../util/util';

export default class ProfileView {
    public static updateView(villager: Villager, fromListId: string): void {
        stateService.currentLoadedProfileId = villager.id;

        clearElement($('profile'));

        this.appendVillagerInfo(villager);
        this.appendWikiAndStoreButtons(villager);

        this.updateListSelect(fromListId);
        this.updateProfileImage(villager);

        this.fadeTransition();
    }

    public static updateListSelect(selectedListId?: string): void {
        if (!stateService.aProfileIsLoaded()) {
            return;
        }

        if (selectedListId) {
            stateService.currentListSelect = selectedListId;
        }

        (<HTMLSelectElement>$('list_select')).disabled = stateService.listsAreEmpty();
        clearElement($('list_select'));
        for (const list of stateService.getLists()) {
            // tslint:disable-next-line: triple-equals
            $('list_select').appendChild(this.aListDropdownOption(list, list.id === stateService.currentListSelect));
        }

        this.updateAddVillagerButton();
    }

    public static updateAddVillagerButton(): void {
        clearElement($('add_remove_button'));
        if (stateService.villagerIsInList(stateService.currentLoadedProfileId, getListSelectValue())) {
            $('add_remove_button').appendChild(this.aRemoveVillagerFromListButton());
        } else {
            $('add_remove_button').appendChild(this.anAddVillagerToListButton());
        }
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
        const profileImageElement: HTMLImageElement = <HTMLImageElement>$('profile-image');
        profileImageElement.alt = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.title = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.src = `./villager_heads/${villager.head}`;
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
        return new DivisionBuilder()
            .withPadding(0)
            .withDisplay('inline-block')
            .build();
    }

    private static aWikiIconButton(wikiLink: string): HTMLButtonElement {
        return new ButtonBuilder(() => { window.open(wikiLink, '_blank'); })
            .asFontAwesome('fa-wikipedia-w')
            .withTitle('Open Wiki page')
            .withClassNames('clickable')
            .build();
    }

    private static aStoreIconButton(storeLink: string): HTMLButtonElement {
        return new ButtonBuilder(() => { window.open(storeLink, '_blank'); })
            .asFontAwesome('fa-shopping-bag')
            .withTitle('Buy this art!')
            .withClassNames('clickable')
            .build();
    }

    private static aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
        const dropdownOption: HTMLOptionElement = document.createElement('option');
        dropdownOption.innerHTML = list.title;
        dropdownOption.value = list.id.toString();
        dropdownOption.selected = isSelected;
        return dropdownOption;
    }

    private static aTextNode(text: string): Text | HTMLSpanElement {
        return text === '' ? this.anNASpanElement() : document.createTextNode(text);
    }

    private static aNameIcon(): HTMLElement {
        return new IconBuilder('fa-tag')
            .withTitle('Name')
            .build();
    }

    private static aSpeciesIcon(): HTMLElement {
        return new IconBuilder('fa-user')
            .withTitle('Species')
            .build();
    }

    private static aPersonalityIcon(): HTMLElement {
        return new IconBuilder('fa-heart')
            .withTitle('Personality')
            .build();
    }

    private static aCoffeeIcon(): HTMLElement {
        return new IconBuilder('fa-coffee')
            .withTitle('Favourite coffee')
            .build();
    }

    private static aBirthdayIcon(villager: Villager): HTMLButtonElement | HTMLElement {
        if (birthdayIsToday(villager.birthday)) {
            return this.aBirthdayButton(villager.name);
        } else {
            return new IconBuilder('fa-birthday-cake')
                .withTitle('Birthday')
                .build();
        }
    }

    private static aBirthdayTextNode(birthday: string): Text | HTMLSpanElement {
        if (birthdayIsToday(birthday)) {
            const birthdaySpan: HTMLSpanElement = document.createElement('span');
            birthdaySpan.innerHTML = birthday;
            birthdaySpan.className = 'birthday';
            return birthdaySpan;
        } else {
            return this.aTextNode(birthday);
        }
    }

    private static aBirthdayButton(villagerName: string): HTMLButtonElement {
        return new ButtonBuilder(() => { new Audio('./happybirthday.mp3').play(); })
            .asFontAwesome('fa-birthday-cake')
            .withTitle(`Happy birthday to ${villagerName}!`)
            .withClassNames('clickable')
            .withColor('hotpink')
            .build();
    }

    private static anAddVillagerToListButton(): HTMLButtonElement {
        const isDisabled = stateService.listsAreEmpty();

        return new ButtonBuilder(() => { addVillager(stateService.currentLoadedProfileId, getListSelectValue()); })
            .withTitle('Add to list')
            .asFontAwesome('fa-plus')
            .withClassNames(isDisabled ? 'disabled' : 'clickable')
            .isDisabled(isDisabled)
            .build();
    }

    private static aRemoveVillagerFromListButton(): HTMLButtonElement {
        return new ButtonBuilder(() => { removeVillager(stateService.currentLoadedProfileId, getListSelectValue()); })
            .withTitle('Remove from list')
            .asFontAwesome('fa-minus')
            .withClassNames('clickable')
            .build();
    }

    private static anNASpanElement(): HTMLSpanElement {
        const naElement: HTMLSpanElement = document.createElement('span');
        naElement.className = 'na';
        naElement.innerHTML = 'N/A';
        return naElement;
    }

    private static fadeTransition() {
        /* // Transition:
        // Hide:
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

