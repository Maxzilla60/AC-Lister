import VillagerList from '../models/villagerlist.model';
import AppStateService from '../state/state.service';
import { getElement as $, replaceChildren } from '../util';
import ViewerComponents from './viewer.components';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import lozad from 'lozad';

export default class Controller {
	private lozadObserver: lozad.Observer;
	private lists: VillagerList[];

	private listsElement: HTMLUListElement;

	constructor() {
		this.listsElement = $('lists') as HTMLUListElement;
		this.lozadObserver = lozad();
	}

	public init(): void {
		const state = new AppStateService();
		this.lists = state.getLists();
		this.renderLists();
		$('image_button').addEventListener('click', this.exportAsImage);
	}

	private renderLists(): void {
		if (this.lists.length <= 0) {
			replaceChildren(this.listsElement, ViewerComponents.aNoListInfoElement());
			return;
		}

		const fragment = document.createDocumentFragment();
		for (const list of this.lists) {
			fragment.appendChild(ViewerComponents.aListElement(list));
		}
		replaceChildren(this.listsElement, fragment);
		this.observeLazyLoadedImages();
	}

	private exportAsImage(): void {
		$('menu').style.display = 'none';
		html2canvas($('main_container')).then((canvas) => {
			canvas.toBlob((blob) => {
				saveAs(blob, 'AnimalCrossing-VillagerLists.png');
				$('menu').style.display = '';
			});
		});
	}

	private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
