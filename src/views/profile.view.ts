import ButtonBuilder from '../components/ButtonBuilder';
import ListItemBuilder from '../components/ListItemBuilder';
import SpanBuilder from '../components/SpanBuilder';
import Controller from '../controller';
import Villager from '../models/villager.model';
import { VillagerList } from '../models/villagerlist.model';
import { stateService } from '../util/state.service';
import { aTextNode, birthdayIsToday, clearElement, getElement as $, getListSelectValue } from '../util/util';

export default class ProfileView {
    public static updateView(villager: Villager, fromListId: string): void {
        stateService.currentLoadedProfileId = villager.id;
        this.appendVillagerInfo(villager);
        this.updateListSelect(fromListId);
        this.updateProfileImage(villager);
    }

    public static updateListSelect(selectedListId?: string): void {
        if (!stateService.aProfileIsLoaded()) {
            return;
        }

        if (selectedListId) {
            stateService.currentListSelect = selectedListId;
        }

        const fragment = document.createDocumentFragment();
        for (const list of stateService.getLists()) {
            fragment.appendChild(this.aListDropdownOption(list, list.id === stateService.currentListSelect));
        }

        ($('list_select') as HTMLSelectElement).disabled = stateService.listsAreEmpty();
        clearElement($('list_select'));
        $('list_select').appendChild(fragment);

        this.updateAddVillagerButton();
    }

    public static updateAddVillagerButton(): void {
        const addRemoveButton = $('add_remove_button') as HTMLButtonElement;
        if (stateService.villagerIsInList(stateService.currentLoadedProfileId, getListSelectValue())) {
            addRemoveButton.onclick = Controller.removeVillager;
            addRemoveButton.className = 'clickable fa fa-minus';
            addRemoveButton.title = 'Remove from list';
            addRemoveButton.disabled = false;
        } else {
            addRemoveButton.onclick = Controller.addVillager;
            addRemoveButton.className = 'clickable fa fa-plus';
            addRemoveButton.title = 'Add to list';
            addRemoveButton.disabled = stateService.listsAreEmpty();
        }
    }

    private static appendVillagerInfo(villager: Villager) {
        const fragment = document.createDocumentFragment();

        // TODO: Update instead or re-inserting?
        fragment.appendChild(this.aProfileInfoListItem('fa-tag', 'Name', villager.name));
        fragment.appendChild(this.aProfileInfoListItem('fa-user', 'Species', villager.species));
        fragment.appendChild(this.aProfileInfoListItem('fa-heart', 'Personality', villager.personality));
        fragment.appendChild(this.aProfileInfoListItem('fa-coffee', 'Favourite coffee', villager.coffee));
        fragment.appendChild(
            birthdayIsToday(villager.birthday) ?
                this.aBirthdayEasterEggInfoListItem(villager) :
                this.aProfileInfoListItem('fa-birthday-cake', 'Birthday', villager.birthday)
        );
        fragment.appendChild(this.aWikiIconButton(villager.wiki));
        fragment.appendChild(this.aStoreIconButton(villager.store));

        const villagerInformationElement = $('villager_information');
        clearElement(villagerInformationElement);
        villagerInformationElement.appendChild(fragment);
    }

    private static updateProfileImage(villager: Villager): void {
        const profileImageElement: HTMLImageElement = $('profile_image') as HTMLImageElement;
        profileImageElement.src = `./villager_heads/${this.getProfileImage(villager)}`;
    }

    private static getProfileImage(villager: Villager): string {
        return villager.hasProfileImage ? `${villager.id}.jpg` : 'wip.jpg';
    }

    private static aWikiIconButton(wikiLink: string): HTMLButtonElement {
        return new ButtonBuilder(() => { window.open(wikiLink, '_blank'); })
            .asFontAwesome('fa-wikipedia-w', true)
            .withTitle('Open Wiki page')
            .isClickable()
            .build();
    }

    private static aStoreIconButton(storeLink: string): HTMLButtonElement {
        return new ButtonBuilder(() => { window.open(storeLink, '_blank'); })
            .asFontAwesome('fa-shopping-bag')
            .withTitle('Buy this art!')
            .isClickable()
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
        return new ButtonBuilder(Controller.birthdayHurray)
            .asFontAwesome('fa-birthday-cake')
            .withId('birthday_button')
            .withTitle(`Happy birthday to ${villagerName}!`)
            .isClickable()
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
