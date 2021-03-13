const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const { supportedSMSCommands } = require('./lib/SMSBackend');
const { startSMSApplication } = require('./lib/SMSBackend');
const { testNotification } = require('./lib/settingManager');
const { logger } = require('./lib/logger');
const { testDevice } = require('./lib/settingManager');
const { installCrons } = require('./lib/cronConnection');
const { saveConfig, readConfig } = require('./lib/env');
const { syncDevice } = require('./lib/settingManager');
const { addDevice } = require('./lib/settingManager');
const { saveKeycloakJson } = require('./lib/smartthingsManager');
const { checkSmartthings } = require('./lib/smartthingsManager');
const { startApplication } = require('./lib/ServiceBackend');
const {
  getSettings, saveSetting, deleteUser, deleteDevice,
} = require('./lib/settingManager');
const {
  connectAuthentication, protect,
} = require('./authenticationConnection');

const config = readConfig();
const { uiPort } = config.server || { port: 8099, uiPort: 8080 };

let app;
const appUI = express();
appUI.use(bodyParser.json());
appUI.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin(o, callback) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};

appUI.use(cors(corsOptions));

const connectionType = connectAuthentication(appUI);
config.connectionType = connectionType;
saveConfig(config);

appUI.use('/', protect(), cors(corsOptions), express.static(`${__dirname}/ui`));

appUI.get('/ui/settings', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await getSettings(req, res);
});

appUI.get('/ui/smartthings/check', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await checkSmartthings(req, res);
});

appUI.post('/ui/settings', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  saveSetting(req, res);
  startApplication();
  startSMSApplication();
});

appUI.post('/ui/settings/deleteUser', protect(), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  deleteUser(req, res);
});

appUI.post('/ui/settings/saveKeycloak', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await saveKeycloakJson(req, res);
});

appUI.post('/ui/settings/deleteDevice', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await deleteDevice(req, res);
});

appUI.post('/ui/settings/addDevice', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await addDevice(req, res);
});

appUI.post('/ui/settings/testDevice', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await testDevice(req, res);
});

appUI.post('/ui/settings/testNotification', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await testNotification(req, res);
});

appUI.get('/ui/settings/syncDevices', protect(), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await syncDevice(req, res);
});

appUI.get('/ui/sms/help', protect(), cors(corsOptions), async (req, res) => {
  const rc = readConfig();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(supportedSMSCommands.map((command) => `phev ${rc.smartthings.sms.password} ${command}`)));
});

startApplication();
startSMSApplication();
appUI.listen(uiPort, () => {
  logger.info(`HTTP smartthings phevctl UI listening on port ${uiPort}`);
  installCrons();
});

process.on('exit', () => {
  app.stop();
});
