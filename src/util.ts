import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function getElement(elementID: string): HTMLElement {
	return document.getElementById(elementID);
}

export function getChildElementByClassName(element: Element, className: string): Element {
	const children = [...element.children];
	return children.find(child => child.className === className);
}

export function replaceChildren(parentElement: HTMLElement, childElement: Node): void {
	clearElement(parentElement);
	parentElement.appendChild(childElement);
}

export function clearElement(element: HTMLElement): void {
	element.innerHTML = '';
}

export function aTextNode(text: string): Text {
	return document.createTextNode(text);
}

export function aBreakElement(): HTMLElement {
	return document.createElement('br');
}

export function birthdayIsToday(birthdayString: string): boolean {
	const today: Date = new Date();
	const birthday: Date = new Date(birthdayString);
	return today.getDate() === birthday.getDate()
		&& today.getMonth() === birthday.getMonth();
}

export function removeDuplicates(results: any[]): any[] {
	return [...new Set(results)];
}

export function loadImage(src: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.addEventListener('load', () => resolve(src));
		img.addEventListener('error', () => console.error(new Error(`Failed to load image with URL: ${src}`)));
		img.src = src;
	});
}

export function mapToVoid(): OperatorFunction<unknown, void> {
	return map(() => { });
}
