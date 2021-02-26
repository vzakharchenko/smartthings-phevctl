const fs = require('fs');
const mkdirp = require('mkdirp');

const defaultSettings = {
  port: 8099,
  portUI: 8080,
  smartthings: {},
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
  return configJson;
}

let config = readConfig();

function saveConfig(curConfig) {
  const configFile = { ...curConfig };
  mkdirp.sync(`${process.env.HOME}/.remote-ctrl-gsm`);
  let path = config.file;
  delete configFile.file;
  if (!config.file || config.file === './remote-ctrl-gsm/config.json') {
    path = `${process.env.HOME}/.remote-ctrl-gsm/userConfig.json`;
  }
  fs.writeFileSync(path, JSON.stringify(configFile, null, 1), 'UTF-8');
  config = readConfig();
}

module.exports.saveConfig = saveConfig;
module.exports.readConfig = readConfig;
