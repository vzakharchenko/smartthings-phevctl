import Cookies from 'js-cookie';
import { RussianLabels } from './RussianLanguage';

const Labels = {
  servicePort: 'Service Port',
  uiPort: 'UI Port',
  smartthingsAppId: 'Smartthings Application Id',
  smartthingsAppSecret: 'Smartthings Application Secret',
  save: 'Save',
  settings: 'Settings',
  devices: 'Devices',
  addDevice: 'Add Device',
  users: 'Users',
  addUser: 'Add User',
  actionId: 'Action',
  deviceLabel: 'Device Label',
  cooling10Mins: 'Cooling Mode 10 Mins',
  cooling20Mins: 'Cooling Mode 20 Mins',
  cooling30Mins: 'Cooling Mode 30 Mins',
  windscreen10Mins: 'Windscreen Mode 10 Mins',
  windscreen20Mins: 'Windscreen Mode 20 Mins',
  windscreen30Mins: 'Windscreen Mode 30 Mins',
  heating10Mins: 'Heating Mode 10 Mins',
  heating20Mins: 'Heating Mode 20 Mins',
  heating30Mins: 'Heating Mode 30 Mins',
  airconOn: 'Air conditioner On',
  airconOff: 'Air conditioner Off',
  headlightsOn: 'Headlights On',
  headlightsOff: 'Headlights Off',
  parkinglightsOn: 'Parkinglights On',
  parkinglightsOff: 'Parkinglights Off',
  username: 'Username',
  password: 'Password',
  delete: 'Delete',
  shard: 'Smartthings Portal Shard',
  macAddress: 'Outlander PHEV Client Mac Address',
  keycloakJson: 'Securing Applications using keycloak.json',
  testDevice: 'Test Action',
  actionTimeout: 'Action Timeout',
  language: 'Language',
  modalHelp: 'Where to get ',
  modalStep1: '1. Open ',
  modalStep2: '2. Select smartapps in your location ',
  modalStep3: '3. Select your smartapp ',
  modalStep4: '4. get parameter ',
  modelYear: 'Model Year',
  any: 'Any',
  phev2019: '2019',
  battery: 'battery',
  updateValue: 'Update Value',
  loading: 'Loading...',
  batteryFactor: 'Battery Factor',
};

export function getLabels() {
  const currentLanguage = Cookies.get('Language');
  if (currentLanguage === 'Russian') {
    return { ...Labels, ...RussianLabels };
  }
  return Labels;
}

export function setLanguage(language) {
  const currentLanguage = Cookies.get('Language');
  if (currentLanguage !== language) {
    if (language === 'Russian' || language === 'English') {
      Cookies.set('Language', language);
    }
  }
}
