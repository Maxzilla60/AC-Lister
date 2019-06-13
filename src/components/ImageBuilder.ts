import HTMLElementBuilder from './HTMLElementBuilder';

export default class ImageBuilder extends HTMLElementBuilder<HTMLImageElement> {
    public constructor(src: string) {
        super('img');
        this.initLazyLoading(src);
        this.element.setAttribute('aria-hidden', 'true');
    }

    public withAlt(alt: string): ImageBuilder {
        this.element.alt = alt;
        return this;
    }

    private initLazyLoading(src: string): void {
        this.withClassNames('lozad');
        this.element.setAttribute('data-src', src);
    }
}
