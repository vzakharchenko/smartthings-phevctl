const { readConfig } = require('./env');
const { RussianLabels } = require('./RussianLanguage');

const Labels = {
  topbattwarminginfo_plugin_1: "The vehicle can't run due to a low drive battery temperature. The drive battery is now warming up, please wait.",
  topbattwarminginfo_plugin_2: "The vehicle can't run due to a low drive battery temperature. Heating the drive battery is required in order to run, but conditions for heating have not been met. Heating of the drive battery will start when the outside temperature rises and the vehicle is plugged-in, please wait.",
  topbattwarminginfo_warm_1: 'The vehicle can now run because the temperature of the drive battery rose',
  topbattwarminginfo_warm_2: "The vehicle can't run due to a low drive battery temperature. The drive battery is now warming up, please wait.",
  topbattwarminginfo_stop_1: 'There is a possibility that the low temperature of the drive battery is causing it not to run. To heat the drive battery, please put the vehicle in the READY state or plug-in the charger.',
  topbattwarminginfo_stop_2: 'The vehicle can\'t run due to a low drive battery temperature. Heating the drive battery is required in order to run, but conditions for heating have not been met. Heating of the drive battery will start when the outside temperature rises and the vehicle is plugged in, please wait.',
  topbattwarminginfo: 'Please insert the charge cable to prevent low drive battery temp. Warm-up will start upon insertion.',
  errACinfo: 'Pre A/C has stopped. Possible causes of this are as follows: Door is Open. Main battery level is Low. Drive Battery temperature is Low.',
  errTimerinfo: 'Timer Control Error Notification. Timer Control could not be activated',
  errCHGinfo: 'Charge Timer Error Notification. Charge Timer could not be activated',
  err1intrusion: 'Theft Alarm Notification. Unauthorized Intrusion Occurred',
  err1movement: 'Theft Alarm Notification. Illegal Vehicle Movement Occurred.',
  err1perimeter: 'Theft Alarm Notification. The door was opened Illegally.',
  err1ignition: 'Theft Alarm Notification. Illegal Vehicle Movement Occurred.',
  err1silent: 'Theft Alarm Notification. Unauthorized Vibration Occurred.',
  err1other: 'Illegal Access Occurred.',
  confirm: 'Default confirm action execution',
  batteryHeater: 'The battery is warming up',
  preACContInfo: 'Pre A/C did not fulfill Permission conditions. Please check conditions:\n'
      + 'Power supply mode of the electric motor switch: OFF\n'
      + 'Hood: Closed (if the hood is opened once after the power supply mode of the electric motor switch is turned off, the power supply mode of the electric motor switch must be turned on again)\n'
      + 'All doors: closed\n'
      + 'Selector position: P\n'
      + 'Drive battery charged level: 26% or more (will be deactivated if the level drops below 20% while the MITSUBISHI remote control system is working)\n'
      + 'Quick charging is not being performed\n'
      + 'The EV remote-ECU is normal\n'
      + 'The plug-in hybrid EV system is normal\n ',
  evseSlow: 'Confirmation: EVSE Slow Charge',
  evseFastCharge: 'Confirmation: EVSE Fast Charge',
  evseDisableCharge: 'Confirmation: EVSE Disable Charger',
  cooling10Mins: 'Confirmation: Cooling Mode 10 Mins',
  cooling20Mins: 'Confirmation: Cooling Mode 20 Mins',
  cooling30Mins: 'Confirmation: Cooling Mode 30 Mins',
  windscreen10Mins: 'Confirmation: Windscreen Mode 10 Mins',
  windscreen20Mins: 'Confirmation: Windscreen Mode 20 Mins',
  windscreen30Mins: 'Confirmation: Windscreen Mode 30 Mins',
  heating10Mins: 'Confirmation: Heating Mode 10 Mins',
  heating20Mins: 'Confirmation: Heating Mode 20 Mins',
  heating30Mins: 'Confirmation: Heating Mode 30 Mins',
  airconOn: 'Confirmation: Air conditioner On',
  airconOff: 'Confirmation: Air conditioner Off',
  headlightsOn: 'Confirmation: Headlights On',
  headlightsOff: 'Confirmation: Headlights Off',
  parkinglightsOn: 'Confirmation: Parkinglights On',
  parkinglightsOff: 'Confirmation: Parkinglights Off',
};

function getLabels() {
  const currentLanguage = readConfig().language;
  if (currentLanguage === 'Russian') {
    return { ...Labels, ...RussianLabels };
  }
  return Labels;
}

module.exports.getLabels = getLabels;
module.exports.EnglishLabels = Labels;
