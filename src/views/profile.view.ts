import { addVillager, removeVillager } from '../actions';
import ButtonBuilder from '../components/ButtonBuilder';
import IconBuilder from '../components/IconBuilder';
import ListItemBuilder from '../components/ListItemBuilder';
import { Personality } from '../models/personality.enum';
import { Species } from '../models/species.enum';
import { Villager } from '../models/villager.model';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { birthdayIsToday, clearElement, getElement as $, getListSelectValue, villagerHasProfileImage } from '../util/util';

export default class ProfileView {
    public static updateView(villager: Villager, fromListId: string): void {
        stateService.currentLoadedProfileId = villager.id;

        clearElement($('villager_information'));

        this.appendVillagerInfo(villager);

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
            $('list_select').appendChild(this.aListDropdownOption(list, list.id === stateService.currentListSelect));
        }

        this.updateAddVillagerButton();
    }

    public static updateAddVillagerButton(): void {
        const button = <HTMLButtonElement>$('add_remove_button');
        if (stateService.villagerIsInList(stateService.currentLoadedProfileId, getListSelectValue())) {
            button.onclick = () => { removeVillager(stateService.currentLoadedProfileId, getListSelectValue()); };
            button.className = 'clickable fa fa-minus';
            button.title = 'Remove from list';
        } else {
            button.onclick = () => { addVillager(stateService.currentLoadedProfileId, getListSelectValue()); };
            button.className = 'clickable fa fa-plus';
            button.title = 'Add to list';
            button.disabled = stateService.listsAreEmpty();
        }
    }

    private static appendVillagerInfo(villager: Villager) {
        this.appendVillagerNameInfo(villager.name);
        this.appendVillagerSpeciesInfo(villager.species);
        this.appendVillagerPersonalityInfo(villager.personality);
        this.appendVillagerCoffeeInfo(villager.coffee);
        this.appendVillagerBirthdayInfo(villager);
        this.appendWikiAndStoreButtons(villager);
    }

    private static appendWikiAndStoreButtons(villager: Villager) {
        $('villager_information').appendChild(this.aWikiIconButton(villager.wiki));
        $('villager_information').appendChild(this.aStoreIconButton(villager.store));
    }

    private static updateProfileImage(villager: Villager): void {
        const profileImageElement: HTMLImageElement = <HTMLImageElement>$('profile_image');
        profileImageElement.alt = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.title = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.src = `./villager_heads/${villager.head}`;
    }

    private static appendVillagerNameInfo(villagerName: string): void {
        $('villager_information').appendChild(
            new ListItemBuilder()
                .asFontAwesome('fa-tag', 'Name')
                .appendChild(
                    this.aTextNode(villagerName)
                )
                .build()
        );
    }
    private static appendVillagerSpeciesInfo(villagerSpecies: Species): void {
        $('villager_information').appendChild(
            new ListItemBuilder()
                .asFontAwesome('fa-user', 'Species')
                .appendChild(
                    this.aTextNode(villagerSpecies)
                )
                .build()
        );
    }
    private static appendVillagerPersonalityInfo(villagerPersonality: Personality): void {
        $('villager_information').appendChild(
            new ListItemBuilder()
                .asFontAwesome('fa-heart', 'Personality')
                .appendChild(
                    this.aTextNode(villagerPersonality)
                )
                .build()
        );
    }
    private static appendVillagerCoffeeInfo(villagerCoffee: string): void {
        $('villager_information').appendChild(
            new ListItemBuilder()
                .asFontAwesome('fa-coffee', 'Favourite coffee')
                .appendChild(
                    this.aTextNode(villagerCoffee)
                )
                .build()
        );
    }
    private static appendVillagerBirthdayInfo(villager: Villager) {
        // TODO: Birthday Easter Egg
        $('villager_information').appendChild(
            new ListItemBuilder()
                .asFontAwesome('fa-birthday-cake', 'Birthday')
                .appendChild(
                    this.aTextNode(villager.birthday)
                )
                .build()
        );
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

