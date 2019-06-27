import { Personality } from './personality.enum';
import { Species } from './species.enum';

export default interface Villager {
    name: string;
    id: string;
    species: Species;
    personality: Personality;
    coffee: string;
    birthday: string;
    wiki: string;
    store: string;
    hasProfileImage: boolean;
    hasIconImage: boolean;
}
