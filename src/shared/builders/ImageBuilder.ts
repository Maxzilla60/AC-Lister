import HTMLElementBuilder from './HTMLElementBuilder';

export default class ImageBuilder extends HTMLElementBuilder<HTMLImageElement> {
	public constructor(src: string, fallbackSrc: string) {
		super('img');
		this.element.src = src;
		this.element.setAttribute('loading', 'lazy');
		this.element.setAttribute('aria-hidden', 'true');
		this.element.addEventListener('error', (event: ErrorEvent) => {
			(event.target as HTMLImageElement).src = fallbackSrc;
		});
	}

	public withAlt(alt: string): ImageBuilder {
		this.element.alt = alt;
		return this;
	}
}
