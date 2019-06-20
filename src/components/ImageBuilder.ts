import HTMLElementBuilder from './HTMLElementBuilder';

export default class ImageBuilder extends HTMLElementBuilder<HTMLImageElement> {
    public constructor(src: string, fallbackSrc: string) {
        super('img');
        this.initLazyLoading(src);
        this.initFallBackSrc(fallbackSrc);
        this.element.setAttribute('aria-hidden', 'true');
    }

    public withAlt(alt: string): ImageBuilder {
        this.element.alt = alt;
        return this;
    }

    private initFallBackSrc(fallbackSrc: string): void {
        this.element.src = fallbackSrc;
    }

    private initLazyLoading(src: string): void {
        this.withClassNames('lozad');
        this.element.setAttribute('data-src', src);
    }
}

function imageOnError(element: HTMLImageElement, src: string) {
    element.onerror = null;
    element.src = src;
}
