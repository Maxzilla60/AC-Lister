export function getElement(elementID: string): HTMLElement {
    return document.getElementById(elementID);
}

export function getChildElementByClassName(element: Element, className: string): Element {
    const children = [...element.children];
    return children.find(child => child.className === className);
}

export function clearElement(element: HTMLElement): void {
    element.innerHTML = '';
}

// Trim '(2)' from name for duplicate names
export function trimName(name: string): string {
    return name.replace(' (2)', '');
}

export function aTextNode(text: string): Text {
    return document.createTextNode(text);
}

export function aBreakElement(): HTMLElement {
    return document.createElement('br');
}

export function birthdayIsToday(birthdayString: string): boolean {
    const today: Date = new Date();
    const birthday: Date = new Date(birthdayString);
    return today.getDate() === birthday.getDate()
        && today.getMonth() === birthday.getMonth();
}

export function removeDuplicates(results: any[]): any[] {
    return [...new Set(results)];
}
