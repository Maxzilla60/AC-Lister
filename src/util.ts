export function clearElement(element: HTMLElement): void {
    element.innerHTML = '';
}

// Trim '(2)' from name for duplicate names
export function trimName(name: string): string {
    return name.replace(" (2)", "");
}

export function aBreakElement(): HTMLElement {
    return document.createElement('br');
}