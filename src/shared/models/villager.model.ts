import { Personality } from './personality.enum';
import { Species } from './species.enum';

export default class Villager {
	public name: string;
	public id: string;
	public species: Species;
	public personality: Personality;
	public coffee: string;
	public birthday: string;
	public wiki: string;
	public store: string;
	public hasProfileImage: boolean;
	public hasIconImage: boolean;

	// eslint-disable-next-line @typescript-eslint/ban-types
	public static serialize(object: object): Villager {
		return Object.assign(new Villager(), object);
	}

	public birthdayIsToday(): boolean {
		const today: Date = new Date();
		const birthday: Date = new Date(this.birthday);
		return today.getDate() === birthday.getDate()
			&& today.getMonth() === birthday.getMonth();
	}

	public getIconImage(): string {
		return this.hasIconImage ? `${this.id}.gif` : 'default.gif';
	}

	public getProfileImage(): string {
		return this.hasProfileImage ? `${this.id}.webp` : 'wip.webp';
	}
}
