export default class IconBuilder {
    private icon: HTMLElement;
    private classNames: string[] = [];

    public constructor(iconName: string) {
        this.icon = document.createElement('i');
        this.classNames = ['fa', iconName];
        this.icon.setAttribute('aria-hidden', 'true');
    }

    public withTitle(title: string): IconBuilder {
        this.icon.title = title;
        return this;
    }

    public build(): HTMLElement {
        this.icon.className = this.classNames.join(' ');
        return this.icon;
    }
}
