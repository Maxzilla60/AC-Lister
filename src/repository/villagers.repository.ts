import Villager from '../models/villager.model';
import { removeDuplicates } from '../util';
import villagersDB from './villagers.json';

export default class VillagersRepository {
    private readonly villagers: Villager[];

    constructor() {
        this.villagers = villagersDB.map(
            v => Villager.serialize(v)
        );
    }

    public static percentageOfVillagersWithProfileImage(): string {
        const repo = new VillagersRepository();
        const allVillagersCount = repo.getAllVillagers().length;
        const villagersWithProfileImageCount = repo.getAllVillagers()
            .filter((v: Villager) => v.hasProfileImage)
            .length;

        const percentage = Math.floor((villagersWithProfileImageCount / allVillagersCount) * 100);
        return `${percentage}% of all villagers have a profile image. (${villagersWithProfileImageCount}/${allVillagersCount})`;
    }

    public getAllVillagers(): Villager[] {
        return this.villagers;
    }

    public getVillagerById(id: string): Villager {
        return this.villagers.find(v => v.id === id);
    }

    public searchFor(query: string): Villager[] {
        if (query === '') {
            return this.getAllVillagers();
        }

        const results: Villager[] = [
            ...this.queryVillagersByName(query),
            ...this.queryVillagersByPersonality(query),
            ...this.queryVillagersBySpecies(query)
        ];

        return removeDuplicates(results);
    }

    public queryVillagersByName(query: string): Villager[] {
        return this.villagers.filter((villager: Villager) => villager.name.toLowerCase().includes(query));
    }

    public queryVillagersByPersonality(query: string): Villager[] {
        return this.villagers.filter((villager: Villager) => villager.personality.toLowerCase().includes(query));
    }

    public queryVillagersBySpecies(query: string): Villager[] {
        return this.villagers.filter((villager: Villager) => villager.species.toLowerCase().includes(query));
    }

    public findVillagersWhosBirthdayIsToday(): Villager[] {
        return this.villagers.filter((v: Villager) => v.birthdayIsToday());
    }
}
