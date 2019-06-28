import HTMLElementBuilder from './HTMLElementBuilder';

export default class ListElementBuilder extends HTMLElementBuilder<HTMLUListElement> {
    public constructor() { super('ul'); }
}
