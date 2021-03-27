import VillagersRepository from '../shared/repository/villagers.repository';
import Presenter from './presenter';

const app = new Presenter();
app.init();
// eslint-disable-next-line @typescript-eslint/dot-notation,@typescript-eslint/unbound-method
window['percentageOfVillagersWithProfileImage'] = VillagersRepository.percentageOfVillagersWithProfileImage;
// eslint-disable-next-line @typescript-eslint/dot-notation
window['villagers'] = VillagersRepository.getAllVillagers();
