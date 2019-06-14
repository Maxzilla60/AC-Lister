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

    private initFallBackSrc(src: string): void {
        this.element.src = src;
        this.element.onerror = (event: Event) => {
            if (src.includes('Cece') {
                console.log('Error, event:', event);
                console.log('Error, this:', this);
                console.log('Error, loading:', src);
            }
            // @ts-ignore
            this.src = src;
        };
    }

    private initLazyLoading(src: string): void {
        this.withClassNames('lozad');
        this.element.setAttribute('data-src', src);
    }
}
