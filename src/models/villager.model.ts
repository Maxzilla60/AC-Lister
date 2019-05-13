import { Personality } from './personality.enum';
import { Species } from './species.enum';

export interface Villager {
    name: string;
    id: string;
    head: string;
    species: Species;
    personality: Personality;
    coffee: string;
    birthday: string; // Date
    wiki: string;
    store: string;
}