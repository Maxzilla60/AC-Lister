import Controller from './controller';
import VillagersRepository from './repository/villagers.repository';

const app = new Controller();
app.init();
// tslint:disable-next-line: no-string-literal
window['percentageOfVillagersWithProfileImage'] = VillagersRepository.percentageOfVillagersWithProfileImage;
// tslint:disable-next-line: no-string-literal
window['villagers'] = VillagersRepository.getAllVillagers();
