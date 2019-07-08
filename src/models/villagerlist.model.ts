import Villager from './villager.model';

export default class VillagerList {
    id: string;
    title: string;
    members: string[];
    fullMembers?: Villager[];
}
