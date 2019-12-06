import HTMLElementBuilder from './HTMLElementBuilder';
import { HTMLEvent } from './HTMLEvent.type';

export default class ButtonBuilder extends HTMLElementBuilder<HTMLButtonElement> {
	public constructor(onclick: HTMLEvent) {
		super('button');
		this.element.addEventListener('click', onclick);
	}

	public asFontAwesome(iconName: string, brandIcon = false): ButtonBuilder {
		this.withClassNames(
			brandIcon ? 'fab' : 'fa',
			iconName,
		);
		this.element.setAttribute('aria-hidden', 'true');
		return this;
	}

	public isDisabled(disabled = true): ButtonBuilder {
		this.element.disabled = disabled;
		return this;
	}
}
