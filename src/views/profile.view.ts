import ProfileComponents from '../components/profile.components';
import Villager from '../models/villager.model';
import VillagerList from '../models/villagerlist.model';
import { getElement as $, loadImage, replaceChildren } from '../util/util';
import { Observable, Subject } from 'rxjs';

export default class ProfileView {
    private currentProfile: Villager;
    private currentSelectedList: string;
    private currentLists: VillagerList[];

    private villagerInformationElement: HTMLElement;
    private profileImageElement: HTMLImageElement;
    private listSelectElement: HTMLSelectElement;
    private addRemoveButton: HTMLButtonElement;

    private readonly noProfileImageSrc: string;
    private readonly preloadedLoadingGifSrc: string = '/loading.gif';

    private readonly addVillagerClickedSubject = new Subject<{ villagerIdToAdd: string, listId: string }>();
    private readonly removeVillagerClickedSubject = new Subject<{ villagerIdToAdd: string, listId: string }>();

    constructor() {
        this.preloadImages();
        this.villagerInformationElement = $('villager_information');
        this.profileImageElement = $('profile_image') as HTMLImageElement;
        this.noProfileImageSrc = this.profileImageElement.src;
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
        if (!this.currentListsAreEmpty()) {
            this.updateListSelectOptions();
        }
        if (listIdToSelect) {
            this.selectList(listIdToSelect);
        } else if (!this.currentListsAreEmpty()) {
            this.currentSelectedList = this.currentLists[0].id;
        }
        this.updateAddRemoveVillagerButton();
    }

    public updateLists(lists: VillagerList[]): void {
        this.currentLists = lists;
        if (this.currentProfile) {
            this.updateListSelectOptions();
            this.updateSelectedList();
            this.updateAddRemoveVillagerButton();
        }
    }

    public selectList(listId: string): void {
        this.currentSelectedList = listId;
        const listSelectOptions = [...this.listSelectElement.children];
        const listToSelect = listSelectOptions.find(listOption => (listOption as HTMLOptionElement).value === listId) as HTMLOptionElement;
        listToSelect.selected = true;
        this.updateAddRemoveVillagerButton();
    }

    public get addVillagerClicked$(): Observable<{ villagerIdToAdd: string, listId: string }> {
        return this.addVillagerClickedSubject.asObservable();
    }

    public get removeVillagerClicked$(): Observable<{ villagerIdToAdd: string, listId: string }> {
        return this.removeVillagerClickedSubject.asObservable();
    }

    private preloadImages(): void {
        loadImage(this.preloadedLoadingGifSrc);
    }

    private listSelectChanged(): void {
        this.currentSelectedList = this.listSelectElement.value;
        this.updateAddRemoveVillagerButton();
    }

    private addVillagerClicked(): void {
        this.addVillagerClickedSubject.next({ villagerIdToAdd: this.currentProfile.id, listId: this.currentSelectedList });
    }

    private removeVillagerClicked(): void {
        this.removeVillagerClickedSubject.next({ villagerIdToAdd: this.currentProfile.id, listId: this.currentSelectedList });
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

        this.listSelectElement.disabled = this.currentListsAreEmpty();
        replaceChildren(this.listSelectElement, fragment);
    }

    private updateSelectedList(): void {
        if (this.currentListsAreEmpty()) {
            this.currentSelectedList = undefined;
        } else if (!this.currentSelectedList) {
            this.selectList(this.currentLists[0].id);
        }
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
            this.addRemoveButton.disabled = this.currentListsAreEmpty()
                ;
        }
    }

    private currentListsAreEmpty(): boolean {
        return this.currentLists.length <= 0;
    }

    private villagerIsInList(villager: Villager, listId: string): boolean {
        const list = this.getListById(listId);
        return list && !this.currentListsAreEmpty() && list.members.includes(villager.id);
    }

    private getListById(listId: string): VillagerList {
        return this.currentLists.find(list => list.id === listId);
    }

    private isCurrentlySelected(list: VillagerList): boolean {
        return list.id === this.currentSelectedList;
    }

    private updateProfileImage(): void {
        // TODO:
        // https://blog.teamtreehouse.com/learn-asynchronous-image-loading-javascript
        // https://jsfiddle.net/fracz/kf8c6t1v/
        this.profileImageElement.className = 'loading';
        this.profileImageElement.src = this.preloadedLoadingGifSrc;
        loadImage(`/villager_heads/${this.currentProfile.getProfileImage()}`)
            .then(src => {
                this.profileImageElement.src = src;
            })
            .finally(() => {
                this.profileImageElement.className = '';
            });
    }
}
