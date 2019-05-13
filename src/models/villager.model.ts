import { Personality } from './personality.enum';
import { Species } from './species.enum';

class Serializable {
    fillFromJSON(json: string) {
        var jsonObj = JSON.parse(json);
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName]
        }
    }
}

export interface Villager extends Serializable {
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