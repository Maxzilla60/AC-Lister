import HTMLElementBuilder from './HTMLElementBuilder';

export default class IconBuilder extends HTMLElementBuilder<HTMLElement> {
    public constructor(iconName: string) {
        super('i');
        this.classNames = ['fa', iconName];
        this.element.setAttribute('aria-hidden', 'true');
    }
}
