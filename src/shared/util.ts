import SpanBuilder from './builders/SpanBuilder';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function getElement(elementID: string): HTMLElement {
	return document.getElementById(elementID);
}

export function getChildElementByClassName(element: Element, className: string): Element {
	const children = [...element.children];
	return children.find(child => child.className === className);
}

export function clearElement(element: HTMLElement): void {
	element.innerHTML = '';
}

export function replaceChildren(parentElement: HTMLElement, childElement: Node): void {
	clearElement(parentElement);
	parentElement.appendChild(childElement);
}

export function aTextNode(text: string): Text {
	return document.createTextNode(text);
}

export function aSpanElement(text: string): HTMLSpanElement {
	return new SpanBuilder(text).build();
}

export function removeDuplicates<T>(results: T[]): T[] {
	return [...new Set(results)];
}

export function loadImage(src: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.addEventListener('load', () => resolve(src));
		img.addEventListener('error', () => reject(src));
		img.src = src;
	});
}

export function mapToVoid(): OperatorFunction<unknown, void> {
	return map(() => { });
}
