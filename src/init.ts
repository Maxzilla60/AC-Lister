import Controller from './controller';
import VillagersRepository from './util/villagers.repository';

// TODO: addEventListener

const app = new Controller();
app.init();
window['percentageOfVillagersWithProfileImage'] = VillagersRepository.percentageOfVillagersWithProfileImage;
window['villagers'] = new VillagersRepository().getAllVillagers();
