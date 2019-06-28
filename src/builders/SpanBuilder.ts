import HTMLElementBuilder from './HTMLElementBuilder';

export default class SpanBuilder extends HTMLElementBuilder<HTMLSpanElement> {
    public constructor(innerHTML: string) {
        super('span');
        this.element.innerHTML = innerHTML;
    }
}