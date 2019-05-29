import { HTMLEvent } from './HTMLEvent.type';

export default class ButtonBuilder {
    private button: HTMLButtonElement;
    private classNames: string[] = [];

    public constructor(onclick: HTMLEvent) {
        this.button = document.createElement('button');
        this.button.onclick = onclick;
    }

    public asFontAwesome(iconName: string): ButtonBuilder {
        this.classNames = [...new Set(['fa', iconName, ...this.classNames])];
        this.button.setAttribute('aria-hidden', 'true');
        return this;
    }

    public withTitle(title: string): ButtonBuilder {
        this.button.title = title;
        return this;
    }

    public withInnerHTML(innerHTML: string): ButtonBuilder {
        this.button.innerHTML = innerHTML;
        return this;
    }

    public withClassNames(...classnames: string[]): ButtonBuilder {
        this.classNames = [...new Set([...this.classNames, ...classnames])];
        return this;
    }

    public isDisabled(disabled: boolean = true): ButtonBuilder {
        this.button.disabled = disabled;
        return this;
    }

    public withColor(color: string): ButtonBuilder {
        this.button.style.color = color;
        return this;
    }

    public withChildren(...children: HTMLElement[]): ButtonBuilder {
        children.forEach(child => this.button.appendChild(child));
        return this;
    }

    public appendChild(child: HTMLElement): ButtonBuilder {
        this.button.appendChild(child);
        return this;
    }

    public build(): HTMLButtonElement {
        this.button.className = this.classNames.join(' ');
        return this.button;
    }
}
