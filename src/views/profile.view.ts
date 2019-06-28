import ProfileComponents from '../components/profile.components';
import Villager from '../models/villager.model';
import VillagerList from '../models/villagerlist.model';
import { getElement as $, replaceChildren } from '../util/util';
import IProfileController from './interfaces/profilecontroller.interface';

export default class ProfileV {
    private controller: IProfileController;
    private currentProfile: Villager;
    private currentSelectedList: string;
    private currentLists: VillagerList[];
    private villagerInformationElement: HTMLElement;
    private profileImageElement: HTMLImageElement;
    private listSelectElement: HTMLSelectElement;
    private addRemoveButton: HTMLButtonElement;

    constructor(controller: IProfileController) {
        this.controller = controller;
        this.villagerInformationElement = $('villager_information');
        this.profileImageElement = $('profile_image') as HTMLImageElement;
        this.listSelectElement = $('list_select') as HTMLSelectElement;
        this.addRemoveButton = $('add_remove_button') as HTMLButtonElement;
    }

    public init(lists: VillagerList[]): void {
        this.currentLists = lists;
        if (lists.length > 0) {
            this.currentSelectedList = lists[0].id;
        }
        this.listSelectElement.onchange = () => {
            this.listSelectChanged();
        };
    }

    public updateProfile(villager: Villager, listIdToSelect?: string): void {
        this.currentProfile = villager;
        this.updateProfileImage();
        this.appendVillagerInfo();
        if (this.currentLists.length > 0) {
            this.updateListSelectOptions();
        }
        if (listIdToSelect) {
            this.selectList(listIdToSelect);
        } else if (this.currentLists.length > 0) {
            this.currentSelectedList = this.currentLists[0].id;
        }
        this.updateAddRemoveVillagerButton();
    }

    public updateLists(lists: VillagerList[]): void {
        this.currentLists = lists;
        if (this.currentProfile) {
            this.updateListSelectOptions();
            this.updateAddRemoveVillagerButton();
            return;
        }
    }

    public selectList(listId: string): void {
        this.currentSelectedList = listId;
        const listSelectOptions = [...this.listSelectElement.children];
        const listToSelect = listSelectOptions.find(listOption => (listOption as HTMLOptionElement).value === listId) as HTMLOptionElement;
        listToSelect.selected = true;
        this.updateAddRemoveVillagerButton();
    }

    private listSelectChanged(): void {
        this.currentSelectedList = this.listSelectElement.value;
        this.updateAddRemoveVillagerButton();
    }

    private addVillagerClicked(): void {
        this.controller.addVillagerToList(this.currentProfile.id, this.currentSelectedList);
    }

    private removeVillagerClicked(): void {
        this.controller.removeVillagerFromList(this.currentProfile.id, this.currentSelectedList);
    }

    private appendVillagerInfo(): void {
        const fragment = ProfileComponents.aProfileElement(this.currentProfile);
        replaceChildren(this.villagerInformationElement, fragment);
    }

    private updateListSelectOptions(): void {
        const fragment = document.createDocumentFragment();
        for (const list of this.currentLists) {
            fragment.appendChild(ProfileComponents.aListDropdownOption(list, this.isCurrentlySelected(list)));
        }

        this.listSelectElement.disabled = this.currentLists.length <= 0;
        replaceChildren(this.listSelectElement, fragment);
    }

    private updateAddRemoveVillagerButton(): void {
        if (!this.currentProfile) {
            return;
        }
        if (this.villagerIsInList(this.currentProfile, this.currentSelectedList)) {
            this.addRemoveButton.onclick = () => { this.removeVillagerClicked(); };
            this.addRemoveButton.className = 'clickable fa fa-minus';
            this.addRemoveButton.title = 'Remove from list';
            this.addRemoveButton.disabled = false;
        } else {
            this.addRemoveButton.onclick = () => { this.addVillagerClicked(); };
            this.addRemoveButton.className = 'clickable fa fa-plus';
            this.addRemoveButton.title = 'Add to list';
            this.addRemoveButton.disabled = this.currentLists.length <= 0;
        }
    }

    private villagerIsInList(villager: Villager, listId: string): boolean {
        const list = this.getListById(listId);
        return this.currentLists.length > 0 && list.members.includes(villager.id);
    }

    private getListById(listId: string): VillagerList {
        return this.currentLists.find(list => list.id === listId);
    }

    private isCurrentlySelected(list: VillagerList): boolean {
        return list.id === this.currentSelectedList;
    }

    private updateProfileImage(): void {
        this.profileImageElement.src = `./villager_heads/${this.currentProfile.getProfileImage()}`;
    }
}
