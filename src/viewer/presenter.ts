import Villager from '../shared/models/villager.model';
import VillagerList from '../shared/models/villagerlist.model';
import AppStateService from '../shared/state/state.service';
import { getElement as $, replaceChildren } from '../shared/util';
import ViewerComponents from './viewer.components';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import lozad from 'lozad';

export default class Presenter {
	private lists: VillagerList[];
	private readonly listsElement: HTMLUListElement;
	private readonly lozadObserver: lozad.Observer;

	constructor() {
		this.listsElement = $('lists') as HTMLUListElement;
		this.lozadObserver = lozad();
	}

	public init(): void {
		this.initLists();
		this.renderLists();
		$('image_button').addEventListener('click', this.exportAsImage);
		$('text_button').addEventListener('click', this.exportAsText.bind(this));
		$('share_button').addEventListener('click', this.shareLink.bind(this));
	}

	private shareLink(): void {
		prompt('Copy the link and share!',
			`http://${window.location.host}/viewer/index.html?lists=${encodeURIComponent(JSON.stringify(this.lists))}`);
	}

	private initLists(): void {
		const state = new AppStateService();
		const currentURL = new URL(window.location.href);
		const sharedListsInUrl = currentURL.searchParams.get('lists');

		if (sharedListsInUrl) {
			this.lists = state.parseAndSerializeJSONToLists(decodeURIComponent(sharedListsInUrl));
		} else {
			this.lists = state.getLists();
		}
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
		}).catch(e => $('menu').style.display = '');
	}

	private exportAsText(): void {
		const content: string = mapListsToText(this.lists) + '\nMade with Animal Crossing Villager Lister\n(https://ac-lister.netlify.com/)';
		const contentAsBlob = new Blob([content], { type: 'text/plain;charset-utf-8' });

		saveAs(contentAsBlob, 'AnimalCrossing-VillagerLists.txt');

		function mapListsToText(lists: VillagerList[]): string {
			return lists.map(list =>
				`${list.title}:\n${mapListMembersToText(list.members)}\n`,
			).join('\n');
		}

		function mapListMembersToText(members: Villager[]): string {
			return members.map(member =>
				`\t- ${member.name}`,
			).join('\n');
		}
	}

	private observeLazyLoadedImages(): void { this.lozadObserver.observe(); }
}
