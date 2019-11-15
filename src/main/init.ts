import VillagersRepository from '../shared/repository/villagers.repository';
import Presenter from './presenter';

const app = new Presenter();
app.init();
// tslint:disable-next-line: no-string-literal
window['percentageOfVillagersWithProfileImage'] = VillagersRepository.percentageOfVillagersWithProfileImage;
// tslint:disable-next-line: no-string-literal
window['villagers'] = VillagersRepository.getAllVillagers();
