import AppStateService from '../state/state.service';
import { getElement as $, replaceChildren } from '../util';
import ViewerComponents from './components';
import lozad from 'lozad';

export default class Controller {
	private state: AppStateService;
	private lozadObserver: lozad.Observer;

	constructor() {
		this.state = new AppStateService();
		this.lozadObserver = lozad();
	}

	public init(): void {
		const lists = this.state.getLists();
		const fragment = document.createDocumentFragment();
		for (const list of lists) {
			fragment.appendChild(ViewerComponents.aListElement(list));
		}

		replaceChildren($('lists'), fragment);
		this.observeLazyLoadedImages();
	}

	private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
