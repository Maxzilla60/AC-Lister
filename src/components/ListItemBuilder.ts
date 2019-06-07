import HTMLElementBuilder from './HTMLElementBuilder';
import IconBuilder from './IconBuilder';

export default class ListItemBuilder extends HTMLElementBuilder<HTMLLIElement> {
    private fontAwesomeIconName: string = null;
    private fontAwesomeIconTitle: string = null;

    public constructor() {
        super('li');
    }

    public asFontAwesome(iconName: string, iconTitle: string): ListItemBuilder {
        this.fontAwesomeIconName = iconName;
        this.fontAwesomeIconTitle = iconTitle;
        return this;
    }

    public build(): HTMLLIElement {
        if (this.fontAwesomeIconName) {
            this.element.prepend(
                this.aFontAwesomeElement()
            );
        }
        return this.element;
    }

    private aFontAwesomeElement(): HTMLSpanElement {
        const span = document.createElement('span');
        span.className = 'fa-li';
        const icon = new IconBuilder(this.fontAwesomeIconName)
            .withTitle(this.fontAwesomeIconTitle)
            .build();
        span.appendChild(icon);
        return span;
    }
}
