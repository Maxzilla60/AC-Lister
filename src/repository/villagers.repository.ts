import Villager from '../models/villager.model';
import { removeDuplicates } from '../util';
import villagersDB from './villagers.json';

export default class VillagersRepository {
    private static readonly villagers: Villager[] = villagersDB.map(
        v => Villager.serialize(v)
    );

    private constructor() { }

    public static percentageOfVillagersWithProfileImage(): string {
        const allVillagersCount = VillagersRepository.getAllVillagers().length;
        const villagersWithProfileImageCount = VillagersRepository.getAllVillagers()
            .filter((v: Villager) => v.hasProfileImage)
            .length;

        const percentage = Math.floor((villagersWithProfileImageCount / allVillagersCount) * 100);
        return `${percentage}% of all villagers have a profile image. (${villagersWithProfileImageCount}/${allVillagersCount})`;
    }

    public static getAllVillagers(): Villager[] {
        return VillagersRepository.villagers;
    }

    public static getVillagerById(id: string): Villager {
        return VillagersRepository.getAllVillagers().find(v => v.id === id);
    }

    public static searchFor(query: string): Villager[] {
        if (query === '') {
            return VillagersRepository.getAllVillagers();
        }

        const results: Villager[] = [
            ...VillagersRepository.queryVillagersByName(query),
            ...VillagersRepository.queryVillagersByPersonality(query),
            ...VillagersRepository.queryVillagersBySpecies(query)
        ];

        return removeDuplicates(results);
    }

    public static queryVillagersByName(query: string): Villager[] {
        return VillagersRepository.getAllVillagers().filter((villager: Villager) => villager.name.toLowerCase().includes(query));
    }

    public static queryVillagersByPersonality(query: string): Villager[] {
        return VillagersRepository.getAllVillagers().filter((villager: Villager) => villager.personality.toLowerCase().includes(query));
    }

    public static queryVillagersBySpecies(query: string): Villager[] {
        return VillagersRepository.getAllVillagers().filter((villager: Villager) => villager.species.toLowerCase().includes(query));
    }

    public static findVillagersWhosBirthdayIsToday(): Villager[] {
        return VillagersRepository.getAllVillagers().filter((v: Villager) => v.birthdayIsToday());
    }
}
