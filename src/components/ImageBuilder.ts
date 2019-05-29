import { HTMLEvent } from './HTMLEvent.type';

export default class ImageBuilder {
    private image: HTMLImageElement;

    public constructor(src: string) {
        this.image = document.createElement('img');
        this.image.src = src;
        this.image.setAttribute('aria-hidden', 'true');
    }

    public withTitle(title: string): ImageBuilder {
        this.image.title = title;
        return this;
    }

    public withAlt(alt: string): ImageBuilder {
        this.image.alt = alt;
        return this;
    }

    public onClick(onclick: HTMLEvent): ImageBuilder {
        this.image.onclick = onclick;
        return this;
    }

    public withFloatLeft(): ImageBuilder {
        this.image.style.cssFloat = 'left';
        return this;
    }

    public build(): HTMLImageElement {
        return this.image;
    }
}
