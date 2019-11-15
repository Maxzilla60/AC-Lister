import VillagersRepository from '../shared/repository/villagers.repository';
import Controller from './controller';

const app = new Controller();
app.init();
// tslint:disable-next-line: no-string-literal
window['percentageOfVillagersWithProfileImage'] = VillagersRepository.percentageOfVillagersWithProfileImage;
// tslint:disable-next-line: no-string-literal
window['villagers'] = VillagersRepository.getAllVillagers();
