import { addVillager, birthdayHurray, removeVillager } from '../actions';
import ButtonBuilder from '../components/ButtonBuilder';
import ListItemBuilder from '../components/ListItemBuilder';
import SpanBuilder from '../components/SpanBuilder';
import { Personality } from '../models/personality.enum';
import { Species } from '../models/species.enum';
import { Villager } from '../models/villager.model';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { aTextNode, birthdayIsToday, clearElement, getElement as $, getListSelectValue, villagerHasProfileImage } from '../util/util';

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

        ($('list_select') as HTMLSelectElement).disabled = stateService.listsAreEmpty();
        clearElement($('list_select'));
        for (const list of stateService.getLists()) {
            $('list_select').appendChild(this.aListDropdownOption(list, list.id === stateService.currentListSelect));
        }

        this.updateAddVillagerButton();
    }

    public static updateAddVillagerButton(): void {
        const addRemoveButton = $('add_remove_button') as HTMLButtonElement;
        if (stateService.villagerIsInList(stateService.currentLoadedProfileId, getListSelectValue())) {
            addRemoveButton.onclick = () => { removeVillager(stateService.currentLoadedProfileId, getListSelectValue()); };
            addRemoveButton.className = 'clickable fa fa-minus';
            addRemoveButton.title = 'Remove from list';
            addRemoveButton.disabled = false;
        } else {
            addRemoveButton.onclick = () => { addVillager(stateService.currentLoadedProfileId, getListSelectValue()); };
            addRemoveButton.className = 'clickable fa fa-plus';
            addRemoveButton.title = 'Add to list';
            addRemoveButton.disabled = stateService.listsAreEmpty();
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
        const profileImageElement: HTMLImageElement = $('profile_image') as HTMLImageElement;
        profileImageElement.alt = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.title = villagerHasProfileImage(villager) ? `Profile image (${villager.name})` : 'Profile image not available (yet)';
        profileImageElement.src = `./villager_heads/${villager.head}`;
    }

    private static appendVillagerNameInfo(villagerName: string): void {
        $('villager_information').appendChild(
            this.aProfileInfoListItem('fa-tag', 'Name', villagerName)
        );
    }
    private static appendVillagerSpeciesInfo(villagerSpecies: Species): void {
        $('villager_information').appendChild(
            this.aProfileInfoListItem('fa-user', 'Species', villagerSpecies)
        );
    }
    private static appendVillagerPersonalityInfo(villagerPersonality: Personality): void {
        $('villager_information').appendChild(
            this.aProfileInfoListItem('fa-heart', 'Personality', villagerPersonality)
        );
    }
    private static appendVillagerCoffeeInfo(villagerCoffee: string): void {
        $('villager_information').appendChild(
            this.aProfileInfoListItem('fa-coffee', 'Favourite coffee', villagerCoffee)
        );
    }
    private static appendVillagerBirthdayInfo(villager: Villager) {
        $('villager_information').appendChild(
            birthdayIsToday(villager.birthday) ?
                this.aBirthdayEasterEggInfoListItem(villager) :
                this.aProfileInfoListItem('fa-birthday-cake', 'Birthday', villager.birthday)
        );
    }

    private static aWikiIconButton(wikiLink: string): HTMLButtonElement {
        return new ButtonBuilder(() => { window.open(wikiLink, '_blank'); })
            .asFontAwesome('fa-wikipedia-w', true)
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

    private static aProfileInfoListItem(iconName: string, iconTitle: string, infoValue: string): HTMLLIElement {
        return new ListItemBuilder()
            .asFontAwesome(iconName, iconTitle)
            .appendChild(
                this.aTextNodeOrNAElement(infoValue)
            )
            .build();
    }

    private static aListDropdownOption(list: VillagerList, isSelected: boolean): HTMLOptionElement {
        const dropdownOption: HTMLOptionElement = document.createElement('option');
        dropdownOption.innerHTML = list.title;
        dropdownOption.value = list.id.toString();
        dropdownOption.selected = isSelected;
        return dropdownOption;
    }

    private static aTextNodeOrNAElement(text: string): Text | HTMLSpanElement {
        return text === '' ? this.anNASpanElement() : aTextNode(text);
    }

    private static aBirthdayEasterEggInfoListItem(villager: Villager): HTMLLIElement {
        return new ListItemBuilder()
            .withChildren(
                this.aBirthdayEasterEggButton(villager.name),
                this.aBirthdayEasterEggTextNode(villager.birthday),
            )
            .build();
    }

    private static aBirthdayEasterEggButton(villagerName: string): HTMLButtonElement {
        return new ButtonBuilder(birthdayHurray)
            .asFontAwesome('fa-birthday-cake')
            .withId('birthday_button')
            .withTitle(`Happy birthday to ${villagerName}!`)
            .withClassNames('clickable')
            .build();
    }

    private static aBirthdayEasterEggTextNode(birthday: string): Text | HTMLSpanElement {
        return new SpanBuilder(birthday)
            .withClassNames('birthday')
            .build();
    }

    private static anNASpanElement(): HTMLSpanElement {
        return new SpanBuilder('N/A')
            .withClassNames('na')
            .build();
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
