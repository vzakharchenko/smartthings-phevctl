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
    executeUpdate: false,
    useCloud: true,
    devices: [],
  },
  cron: {
    syncDevices: '0 */30 * * * *',
    updateDevices: '0 */10 * * * *',
    cloudDevices: '0 */2 * * * *',
    shutdown: '0 */1 * * * *',
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
    batteryHeater: 'none',
    preACContInfo: 'none',
    cooling10Mins: 'sms',
    cooling20Mins: 'sms',
    cooling30Mins: 'sms',
    windscreen10Mins: 'sms',
    windscreen20Mins: 'sms',
    windscreen30Mins: 'sms',
    heating10Mins: 'sms',
    heating20Mins: 'sms',
    heating30Mins: 'sms',
    airconOn: 'sms',
    airconOff: 'sms',
    headlightsOn: 'sms',
    headlightsOff: 'sms',
    parkinglightsOn: 'sms',
    parkinglightsOff: 'sms',
    evseSlow: 'none',
    evseFastCharge: 'none',
    evseDisableCharge: 'none',
  },
  batteryFactory: 1.063829787,
  ups: 'none',
  upsMinValue: '-0.14',
  upsMaxTimeHours: '8',
};

const defaultEVSEConfig = {
  port: 8011,
  evseServer: {
    '/': 'http://192.168.4.1',
    'style.css': 'http://192.168.4.1/style.css',
    'es.js': 'http://192.168.4.1/es.js',
    ajax: 'http://192.168.4.1/ajax',
  },
  users: [
    {
      id: '0',
      username: 'admin',
      password: 'admin',
    },
  ],
};

function readEVSEConfig() {
  let configJson = defaultEVSEConfig;
  const defaultConfigFile = './remote-ctrl-gsm/evseConfig.json';
  if (fs.existsSync(defaultConfigFile)) {
    const text = fs.readFileSync(defaultConfigFile, 'UTF-8');
    const defaultConfigJson = text ? JSON.parse(text) : {};
    defaultConfigJson.file = defaultConfigFile;
    configJson = defaultConfigJson;
  }
  const configFile = '/opt/config/evse-remote-ctrl-gsm.json';
  if (fs.existsSync(configFile)) {
    const text = fs.readFileSync(configFile, 'UTF-8');
    const overrideConfig = text ? JSON.parse(text) : {};
    overrideConfig.file = configFile;
    configJson = overrideConfig;
  }
  const ovverideConfigFile = `${process.env.HOME}/.remote-ctrl-gsm/evseConfig.json`;
  if (fs.existsSync(ovverideConfigFile)) {
    const text = fs.readFileSync(ovverideConfigFile, 'UTF-8');
    const overrideConfig = text ? JSON.parse(text) : {};
    overrideConfig.file = ovverideConfigFile;
    configJson = overrideConfig;
  }
  return configJson;
}

function readConfig() {
  let configJson = defaultSettings;
  const defaultConfigFile = './remote-ctrl-gsm/config.json';
  let isExists = false;
  if (fs.existsSync(defaultConfigFile)) {
    const text = fs.readFileSync(defaultConfigFile, 'UTF-8');
    const defaultConfigJson = text ? JSON.parse(text) : {};
    defaultConfigJson.file = defaultConfigFile;
    configJson = defaultConfigJson;
    isExists = true;
  }
  const ovverideConfigFile = `${process.env.HOME}/.remote-ctrl-gsm/userConfig.json`;
  if (fs.existsSync(ovverideConfigFile)) {
    const text = fs.readFileSync(ovverideConfigFile, 'UTF-8');
    const overrideConfig = text ? JSON.parse(text) : {};
    overrideConfig.file = ovverideConfigFile;
    configJson = overrideConfig;
    isExists = true;
  }
  const configFile = '/opt/config/remote-ctrl-gsm.json';
  if (fs.existsSync(configFile)) {
    const text = fs.readFileSync(configFile, 'UTF-8');
    const overrideConfig = text ? JSON.parse(text) : {};
    overrideConfig.file = configFile;
    configJson = overrideConfig;
    isExists = true;
  }
  if (configJson.smartthings) {
    if (!configJson.smartthings.timeout) {
      configJson.smartthings.timeout = 60000;
    }
    if (!configJson.smartthings.sms) {
      configJson.smartthings.sms = {
        enabled: false,
        password: 'admin',
        smstype: 'none',
      };
    }
  } else {
    configJson.smartthings = {
      timeout: 60000,
      sms: {
        enabled: false,
        password: 'admin',
        smstype: 'none',
      },
    };
  }
  if (!configJson.notifications) {
    configJson.notifications = defaultSettings.notifications;
  }
  Object.keys(defaultSettings.notifications).forEach((k) => {
    if (!configJson.notifications[k]) {
      configJson.notifications[k] = defaultSettings.notifications[k];
    }
  });
  if (!configJson.cron) {
    configJson.cron = defaultSettings.cron;
  }
  if (!configJson.cron.cloudDevices) {
    configJson.cron.cloudDevices = defaultSettings.cron.cloudDevices;
  }
  if (!configJson.cron.shutdown) {
    configJson.cron.shutdown = defaultSettings.cron.shutdown;
  }
  configJson.isExists = isExists;
  return configJson;
}

let config = readConfig();
let evseConfig = readEVSEConfig();

function saveEVSEConfig(curConfig) {
  const configFile = JSON.parse(JSON.stringify(curConfig));
  mkdirp.sync(`${process.env.HOME}/.remote-ctrl-gsm`);
  let path = evseConfig.file;
  if (!evseConfig.file || evseConfig.file === './.remote-ctrl-gsm/config.json') {
    path = `${process.env.HOME}/.remote-ctrl-gsm/evseConfig.json`;
  }
  delete configFile.file;
  if (!configFile.users) {
    configFile.users = defaultEVSEConfig.users;
  }
  if (!configFile.port) {
    configFile.port = 8011;
  }
  fs.writeFileSync(path, JSON.stringify(configFile, null, 1), 'UTF-8');
  evseConfig = readEVSEConfig();
}

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
  const date = new Date();
  fs.writeFileSync(path, JSON.stringify(`${process.env.HOME}/.remote-ctrl-gsm/${date.getFullYear()}_${date.getMonth()}_${date.getDay()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_Config.bak`, null, 1), 'UTF-8');
  fs.writeFileSync(path, JSON.stringify(configFile, null, 1), 'UTF-8');
  config = readConfig();
}
if (!config.isExists) {
  saveConfig(config);
  saveEVSEConfig(evseConfig);
}

module.exports.saveConfig = saveConfig;
module.exports.readConfig = readConfig;

module.exports.saveEVSEConfig = saveEVSEConfig;
module.exports.readEVSEConfig = readEVSEConfig;
