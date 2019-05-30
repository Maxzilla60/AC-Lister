import HTMLElementBuilder from './HTMLElementBuilder';
import { HTMLEvent } from './HTMLEvent.type';

export default class ImageBuilder extends HTMLElementBuilder<HTMLImageElement> {
    public constructor(src: string) {
        super('img');
        this.element.src = src;
        this.element.setAttribute('aria-hidden', 'true');
    }

    public withAlt(alt: string): ImageBuilder {
        this.element.alt = alt;
        return this;
    }

    public onClick(onclick: HTMLEvent): ImageBuilder {
        this.element.onclick = onclick;
        return this;
    }
}
