import HTMLElementBuilder from './HTMLElementBuilder';
import { HTMLEvent } from './HTMLEvent.type';

export default class InputFieldBuilder extends HTMLElementBuilder<HTMLInputElement> {
	public constructor(type: string) {
		super('input');
		this.element.type = type;
	}

	public onChange(event: HTMLEvent): InputFieldBuilder {
		this.element.addEventListener('change', event);
		return this;
	}

	public withValue(value: string): InputFieldBuilder {
		this.element.value = value;
		return this;
	}

	public withMaxLength(length: number): InputFieldBuilder {
		this.element.maxLength = length;
		return this;
	}
}
