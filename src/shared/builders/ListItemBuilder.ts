import HTMLElementBuilder from './HTMLElementBuilder';

export default class ListItemBuilder extends HTMLElementBuilder<HTMLLIElement> {
	private fontAwesomeIconName: string = null;
	private fontAwesomeIconTitle: string = null;

	public constructor() { super('li'); }

	public asFontAwesome(iconName: string, iconTitle: string): ListItemBuilder {
		this.fontAwesomeIconName = iconName;
		this.fontAwesomeIconTitle = iconTitle;
		return this;
	}

	public beforeBuild(): void {
		if (this.fontAwesomeIconName) {
			this.element.prepend(
				this.aFontAwesomeElement(),
			);
		}
	}

	private aFontAwesomeElement(): HTMLSpanElement {
		const label = document.createElement('label');
		label.className = `fa ${this.fontAwesomeIconName}`;
		label.title = this.fontAwesomeIconTitle;
		label.setAttribute('aria-hidden', 'true');
		return label;
	}
}
