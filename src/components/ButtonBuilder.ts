import HTMLElementBuilder from './HTMLElementBuilder';
import { HTMLEvent } from './HTMLEvent.type';

export default class ButtonBuilder extends HTMLElementBuilder<HTMLButtonElement> {
    public constructor(onclick: HTMLEvent) {
        super('button');
        this.element.onclick = onclick;
    }

    public asFontAwesome(iconName: string): ButtonBuilder {
        this.withClassNames('fa', iconName);
        this.element.setAttribute('aria-hidden', 'true');
        return this;
    }

    public isDisabled(disabled: boolean = true): ButtonBuilder {
        this.element.disabled = disabled;
        return this;
    }
}
