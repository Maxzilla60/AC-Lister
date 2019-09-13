import HTMLElementBuilder from './HTMLElementBuilder';
import { HTMLEvent } from './HTMLEvent.type';

export default class IconBuilder extends HTMLElementBuilder<HTMLElement> {
	public constructor(iconName: string) {
		super('i');
		this.classNames = ['fa', iconName];
		this.element.setAttribute('aria-hidden', 'true');
	}

	public onClick(onclick: HTMLEvent): IconBuilder {
		this.element.onclick = onclick;
		return this;
	}
}
