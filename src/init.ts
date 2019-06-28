import Controller from './controller';
import VillagersRepository from './util/villagers.repository';

const app = new Controller();
app.init();
window['percentageOfVillagersWithProfileImage'] = VillagersRepository.percentageOfVillagersWithProfileImage;
window['villagers'] = new VillagersRepository().getAllVillagers();
