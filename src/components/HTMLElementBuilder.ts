export default abstract class HTMLElementBuilder<T extends HTMLElement> {
    protected element: T;
    protected classNames: string[] = [];

    protected constructor(elementTag: string) {
        this.element = document.createElement(elementTag) as T;
    }

    public build(): T {
        this.element.className = this.classNames.join(' ');
        return this.element;
    }

    public withTitle(title: string): HTMLElementBuilder<T> {
        this.element.title = title;
        return this;
    }

    public withInnerHTML(innerHTML: string): HTMLElementBuilder<T> {
        this.element.innerHTML = innerHTML;
        return this;
    }

    public withClassNames(...classnames: string[]): HTMLElementBuilder<T> {
        this.classNames = [...new Set([...this.classNames, ...classnames])];
        return this;
    }

    public withId(idName: string): HTMLElementBuilder<T> {
        this.element.id = idName;
        return this;
    }

    public withChildren(...children: HTMLElement[]): HTMLElementBuilder<T> {
        children.forEach(child => this.element.appendChild(child));
        return this;
    }

    public appendChild(child: Node): HTMLElementBuilder<T> {
        this.element.appendChild(child);
        return this;
    }

    public withPadding(padding: number): HTMLElementBuilder<T> {
        this.element.style.padding = padding.toString();
        return this;
    }

    public withPaddingLeft(padding: number): HTMLElementBuilder<T> {
        this.element.style.paddingLeft = `${padding}px`;
        return this;
    }

    public withPaddingBottom(padding: number): HTMLElementBuilder<T> {
        this.element.style.paddingBottom = `${padding}px`;
        return this;
    }

    public withPaddingTop(padding: number): HTMLElementBuilder<T> {
        this.element.style.paddingTop = `${padding}px`;
        return this;
    }

    public withColor(color: string): HTMLElementBuilder<T> {
        this.element.style.color = color;
        return this;
    }

    public withDisplay(display: 'inline-block' | 'none' | ''): HTMLElementBuilder<T> {
        this.element.style.display = display;
        return this;
    }

    public withFloatLeft(): HTMLElementBuilder<T> {
        this.element.style.cssFloat = 'left';
        return this;
    }
}
