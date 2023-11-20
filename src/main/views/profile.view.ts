import Villager from '../../shared/models/villager.model';
import VillagerList from '../../shared/models/villagerlist.model';
import { getElement as $, loadImage, replaceChildren } from '../../shared/util';
import ProfileComponents from '../components/profile.components';
import { Observable, Subject } from 'rxjs';

export default class ProfileView {
	private currentProfile: Villager;
	private currentSelectedList: string;
	private currentLists: VillagerList[];

	private readonly villagerInformationElement: HTMLElement;
	private readonly profileImageElement: HTMLImageElement;
	private readonly listSelectElement: HTMLSelectElement;
	private readonly addRemoveButton: HTMLButtonElement;

	private readonly noProfileImageSrc: string;
	private readonly preloadedLoadingGifSrc: string = '/loading.gif';

	private readonly addVillagerClickedSubject = new Subject<{ villagerIdToAdd: string, listId: string }>();
	private readonly removeVillagerClickedSubject = new Subject<{ villagerIdToAdd: string, listId: string }>();

	// Kept for removing event listener from the add-remove villager button
	private readonly removeVillagerEvent: () => void = () => { this.removeVillagerClicked(); };
	private readonly addVillagerEvent: () => void = () => { this.addVillagerClicked(); };

	public constructor() {
		this.preloadImages();
		this.villagerInformationElement = $('villager-information');
		this.profileImageElement = $('profile-image') as HTMLImageElement;
		this.noProfileImageSrc = this.profileImageElement.src;
		this.listSelectElement = $('list-select') as HTMLSelectElement;
		this.addRemoveButton = $('add-remove-button') as HTMLButtonElement;
	}

	public init(lists: VillagerList[]): void {
		this.currentLists = lists;
		if (lists.length > 0) {
			this.currentSelectedList = lists[0].id;
		}
		this.listSelectElement.addEventListener('change', () => {
			this.listSelectChanged();
		});
	}

	public updateProfile(villager: Villager, listIdToSelect?: string): void {
		this.currentProfile = villager;
		this.updateProfileImage();
		this.appendVillagerInfo();
		this.updateListSelectOptions();
		if (listIdToSelect) {
			this.selectList(listIdToSelect);
		} else if (!this.currentSelectedList && !this.currentListsAreEmpty()) {
			this.selectList(this.currentLists[0].id);
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

	// #region Events

	public get addVillagerClicked$(): Observable<{ villagerIdToAdd: string, listId: string }> {
		return this.addVillagerClickedSubject.asObservable();
	}

	public get removeVillagerClicked$(): Observable<{ villagerIdToAdd: string, listId: string }> {
		return this.removeVillagerClickedSubject.asObservable();
	}

	private preloadImages(): void {
		void loadImage(this.preloadedLoadingGifSrc);
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

	// #endregion

	// #region DOM Manipulation

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
			this.addRemoveButton.removeEventListener('click', this.addVillagerEvent);
			this.addRemoveButton.addEventListener('click', this.removeVillagerEvent);
			this.addRemoveButton.className = 'clickable fa fa-minus';
			this.addRemoveButton.title = 'Remove from list';
			this.addRemoveButton.disabled = false;
		} else {
			this.addRemoveButton.removeEventListener('click', this.removeVillagerEvent);
			this.addRemoveButton.addEventListener('click', this.addVillagerEvent);
			this.addRemoveButton.className = 'clickable fa fa-plus';
			this.addRemoveButton.title = 'Add to list';
			this.addRemoveButton.disabled = this.currentListsAreEmpty();
		}
	}

	private updateProfileImage(): void {
		// https://blog.teamtreehouse.com/learn-asynchronous-image-loading-javascript
		// https://jsfiddle.net/fracz/kf8c6t1v/
		this.profileImageElement.className = 'loading';
		this.profileImageElement.src = this.preloadedLoadingGifSrc;
		this.profileImageElement.title = this.currentProfile.hasProfileImage ? this.currentProfile.name : 'Image not available (yet)';
		loadImage(`/villager_heads/${this.currentProfile.getProfileImage()}`)
			.then(src => {
				this.profileImageElement.src = src;
			})
			.catch(() => {
				this.profileImageElement.src = this.noProfileImageSrc;
			})
			.finally(() => {
				this.profileImageElement.className = '';
			});
	}

	// #endregion

	private currentListsAreEmpty(): boolean {
		return this.currentLists.length <= 0;
	}

	private villagerIsInList(villager: Villager, listId: string): boolean {
		return !this.currentListsAreEmpty()
			&& this.getListById(listId)
				.members
				.map(v => v.id)
				.includes(villager.id);
	}

	private getListById(listId: string): VillagerList {
		return this.currentLists.find(list => list.id === listId);
	}

	private isCurrentlySelected(list: VillagerList): boolean {
		return list.id === this.currentSelectedList;
	}
}
