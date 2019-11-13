import VillagerList from '../models/villagerlist.model';
import AppStateService from '../state/state.service';
import { getElement as $, replaceChildren } from '../util';
import ViewerComponents from './viewer.components';
import lozad from 'lozad';

export default class Controller {
	private state: AppStateService;
	private lozadObserver: lozad.Observer;
	private lists: VillagerList[];

	constructor() {
		this.lozadObserver = lozad();
	}

	public init(): void {
		const state = new AppStateService();
		this.lists = state.getLists();
		this.renderLists();
	}

	private renderLists(): void {
		if (this.lists.length <= 0) {
			replaceChildren($('lists'), ViewerComponents.aNoListInfoElement());
			return;
		}

		const fragment = document.createDocumentFragment();
		for (const list of this.lists) {
			fragment.appendChild(ViewerComponents.aListElement(list));
		}
		replaceChildren($('lists'), fragment);
		this.observeLazyLoadedImages();
	}

	private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
