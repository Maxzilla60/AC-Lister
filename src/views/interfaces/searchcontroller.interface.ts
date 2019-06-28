import IController from './controller.interface';

export default interface ISearchController extends IController {
    updateSearch(query: string): void;
}
