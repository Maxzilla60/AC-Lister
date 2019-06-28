import IController from './controller.interface';

export default interface IListsController extends IController {
    newList(): void;
    selectList(listId: string): void;
    deleteList(listId: string): void;
    renameList(listId: string, newTitle: string): void;
    clearLists(): void;
    exportLists(): void;
    importLists(listsFile: File): void;
}
