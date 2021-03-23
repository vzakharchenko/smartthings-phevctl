const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const mkdirp = require('mkdirp');

const defaultSettings = {
  port: 8099,
  portUI: 8080,
  portSMS: 8098,
  smartthings: {
    useSmartthings: true,
    sendNotification: true,
    executeUpdate: true,
    useCloud: true,
    devices: [],
  },
  cron: {
    syncDevices: '0 */30 * * * *',
    updateDevices: '0 */10 * * * *',
    cloudDevices: '0 */2 * * * *',
  },
  smartapp: [
    'https://graph.api.smartthings.com',
    'https://graph-na02-useast1.api.smartthings.com',
    'https://graph-na04-useast2.api.smartthings.com',
    'https://graph-eu01-euwest1.api.smartthings.com',
    'https://graph-ap02-apnortheast2.api.smartthings.com',
  ],
  users: [
    {
      id: '0',
      username: 'admin',
      password: 'admin',
    },
  ],
  notifications: {
    topbattwarminginfo_plugin_1: 'both',
    topbattwarminginfo_plugin_2: 'both',
    topbattwarminginfo_warm_1: 'both',
    topbattwarminginfo_warm_2: 'both',
    topbattwarminginfo_stop_1: 'both',
    topbattwarminginfo_stop_2: 'both',
    topbattwarminginfo: 'both',
    errACinfo: 'both',
    err1intrusion: 'both',
    err1movement: 'both',
    err1perimeter: 'both',
    err1ignition: 'both',
    err1silent: 'both',
    err1other: 'both',
    confirm: 'sms',
  },
  batteryFactory: 1.063829787,
};

function readConfig() {
  let configJson = defaultSettings;
  const defaultConfigFile = './remote-ctrl-gsm/config.json';
  if (fs.existsSync(defaultConfigFile)) {
    const text = fs.readFileSync(defaultConfigFile, 'UTF-8');
    const defaultConfigJson = text ? JSON.parse(text) : {};
    defaultConfigJson.file = defaultConfigFile;
    configJson = defaultConfigJson;
  }
  const ovverideConfigFile = `${process.env.HOME}/.remote-ctrl-gsm/userConfig.json`;
  if (fs.existsSync(ovverideConfigFile)) {
    const text = fs.readFileSync(ovverideConfigFile, 'UTF-8');
    const overrideConfig = text ? JSON.parse(text) : {};
    overrideConfig.file = ovverideConfigFile;
    configJson = overrideConfig;
  }
  const configFile = '/opt/config/remote-ctrl-gsm.json';
  if (fs.existsSync(configFile)) {
    const text = fs.readFileSync(configFile, 'UTF-8');
    const overrideConfig = text ? JSON.parse(text) : {};
    overrideConfig.file = configFile;
    configJson = overrideConfig;
  }
  if (!configJson.smartthings.timeout) {
    configJson.smartthings.timeout = 60000;
  }
  if (!configJson.smartthings.sms) {
    configJson.smartthings.sms = {
      enabled: false,
      password: 'admin',
    };
  }
  if (!configJson.notifications) {
    configJson.notifications = defaultSettings.notifications;
  }
  if (!configJson.notifications.confirm) {
    configJson.notifications.confirm = defaultSettings.notifications.confirm;
  }
  if (!configJson.cron) {
    configJson.cron = defaultSettings.cron;
  }
  if (!configJson.cron.cloudDevices) {
    configJson.cron.cloudDevices = defaultSettings.cron.cloudDevices;
  }
  return configJson;
}

let config = readConfig();

function saveConfig(curConfig) {
  const configFile = JSON.parse(JSON.stringify(curConfig));
  mkdirp.sync(`${process.env.HOME}/.remote-ctrl-gsm`);
  let path = config.file;
  delete configFile.file;
  if (!config.file || config.file === './remote-ctrl-gsm/config.json') {
    path = `${process.env.HOME}/.remote-ctrl-gsm/userConfig.json`;
  }
  if (curConfig.smartthings.devices) {
    configFile.smartthings.devices = curConfig.smartthings.devices.map((device) => {
      const d = { ...device };
      d.hvacUpdatable = ['cooling10Mins',
        'cooling20Mins',
        'cooling30Mins',
        'windscreen10Mins',
        'windscreen20Mins',
        'windscreen30Mins',
        'heating10Mins',
        'heating20Mins',
        'heating30Mins',
        'airconOn',
        'airconOff',
      ].includes(device.actionId);
      return d;
    });
  }
  if (!configFile.smartthings.sms.appId) {
    configFile.smartthings.sms.appId = uuidv4();
    configFile.smartthings.sms.secret = uuidv4();
    configFile.portSMS = defaultSettings.portSMS;
  }
  fs.writeFileSync(path, JSON.stringify(configFile, null, 1), 'UTF-8');
  config = readConfig();
}

saveConfig(config);

module.exports.saveConfig = saveConfig;
module.exports.readConfig = readConfig;
