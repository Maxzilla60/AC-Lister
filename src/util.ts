import { lists } from './main';
import { Villager } from './models/villager.model';

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

export function villagerHasProfileImage(villager: Villager): boolean {
    return villager.head !== 'wip.jpg';
}

export function birthdayIsToday(birthdayString: string): boolean {
    const today: Date = new Date();
    const birthday: Date = new Date(birthdayString);
    return today.getDate() === birthday.getDate()
        && today.getMonth() === birthday.getMonth();
}

export function listsAreEmpty(): boolean {
    return lists.length <= 0;
}

export function villagerIsInList(villagerName: string, listId: number): boolean {
    return !listsAreEmpty() && lists.find(l => l.id == listId).members.includes(villagerName);
}