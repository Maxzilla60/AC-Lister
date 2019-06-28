export default abstract class HTMLElementBuilder<T extends HTMLElement> {
    protected element: T;
    protected classNames: string[] = [];

    protected constructor(elementTag: string) {
        this.element = document.createElement(elementTag) as T;
    }

    public build(): T {
        this.beforeBuild();
        this.element.className = this.classNames.join(' ');
        return this.element;
    }

    public beforeBuild(): void { }

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

    public isClickable(): HTMLElementBuilder<T> {
        this.withClassNames('clickable');
        return this;
    }

    public withId(idName: string): HTMLElementBuilder<T> {
        this.element.id = idName;
        return this;
    }

    public withChildren(...children: Node[]): HTMLElementBuilder<T> {
        children.forEach(child => this.element.appendChild(child));
        return this;
    }

    public appendChild(child: Node): HTMLElementBuilder<T> {
        this.element.appendChild(child);
        return this;
    }

    public withDataAttribute(attributeName: string, value: string): HTMLElementBuilder<T> {
        this.element.setAttribute(`data-${attributeName}`, value);
        return this;
    }

    public withFloatLeft(): HTMLElementBuilder<T> {
        this.element.style.cssFloat = 'left';
        return this;
    }
}
