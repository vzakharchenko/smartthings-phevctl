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
  errACinfo: ' Pre A/C has stopped. Possible causes of this are as follows: Door is Open. Main battery level is Low. Drive Battery temperature is Low.',
};

function getLabels() {
  const currentLanguage = readConfig().language;
  if (currentLanguage === 'Russian') {
    return { ...Labels, ...RussianLabels };
  }
  return Labels;
}

module.exports.getLabels = getLabels;