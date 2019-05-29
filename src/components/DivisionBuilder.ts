export default class DivisionBuilder {
    private div: HTMLDivElement;

    public constructor() {
        this.div = document.createElement('div');
    }

    public withInnerHTML(innerHTML: string): DivisionBuilder {
        this.div.innerHTML = innerHTML;
        return this;
    }

    public withChildren(...children: HTMLElement[]): DivisionBuilder {
        children.forEach(child => this.div.appendChild(child));
        return this;
    }

    public withPadding(padding: number): DivisionBuilder {
        this.div.style.padding = padding.toString();
        return this;
    }

    public withPaddingLeft(padding: number): DivisionBuilder {
        this.div.style.paddingLeft = `${padding}px`;
        return this;
    }

    public withPaddingBottom(padding: number): DivisionBuilder {
        this.div.style.paddingBottom = `${padding}px`;
        return this;
    }

    public withPaddingTop(padding: number): DivisionBuilder {
        this.div.style.paddingTop = `${padding}px`;
        return this;
    }

    public withColor(color: string): DivisionBuilder {
        this.div.style.color = color;
        return this;
    }

    public withDisplay(display: 'inline-block' | 'none' | ''): DivisionBuilder {
        this.div.style.display = display;
        return this;
    }

    public build(): HTMLDivElement {
        return this.div;
    }
}
