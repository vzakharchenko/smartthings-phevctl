const express = require('express');

const cors = require('cors');

const bodyParser = require('body-parser');
const { killAll } = require('./lib/executeService');
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
const { getLabels } = require('./lib/Localization');
const {
  getSettings, saveSetting, deleteUser, deleteDevice,
} = require('./lib/settingManager');
const {
  connectAuthentication, protect,
} = require('./authenticationConnection');
const { upsInfo, timeToShutDown } = require('./lib/shutdownService');

const config = readConfig();
const { uiPort } = config.server || { port: 8099, uiPort: 8080 };

const appUI = express();
appUI.set('trust proxy', () => true);
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

const connectionType = connectAuthentication(appUI, config);
config.connectionType = connectionType;
saveConfig(config);

appUI.use('/', protect(config), cors(corsOptions), express.static(`${__dirname}/ui`));

appUI.get('/ui/settings', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await getSettings(req, res);
});

appUI.get('/ui/smartthings/check', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await checkSmartthings(req, res);
});

appUI.get('/ui/ups/info', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const info = { timeToShutDown: await timeToShutDown() };
  res.end(JSON.stringify(upsInfo ? { ...upsInfo, ...info } : { ...info, ...{} }));
});

appUI.post('/ui/settings', protect(config), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  saveSetting(req, res);
  startApplication();
  startSMSApplication();
});

appUI.post('/ui/settings/deleteUser', protect(config), cors(corsOptions), (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  deleteUser(req, res);
});

appUI.post('/ui/settings/saveKeycloak', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await saveKeycloakJson(req, res);
});

appUI.post('/ui/settings/deleteDevice', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await deleteDevice(req, res);
});

appUI.post('/ui/settings/addDevice', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await addDevice(req, res);
});

appUI.post('/ui/settings/testDevice', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await testDevice(req, res);
});

appUI.post('/ui/settings/testNotification', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await testNotification(req, res);
});

appUI.get('/ui/settings/syncDevices', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  await syncDevice(req, res);
});

appUI.get('/ui/sms/help', protect(config), cors(corsOptions), async (req, res) => {
  const rc = readConfig();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(supportedSMSCommands.map((command) => `phev ${rc.smartthings.sms.password} ${command}`)));
});

appUI.get('/ui/sms/codes', protect(config), cors(corsOptions), async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const rc = JSON.parse(JSON.stringify(readConfig()));
  const notifications = {};
  Object.keys(rc.notifications).map((n) => n).forEach((v) => {
    notifications[v] = getLabels()[v] || v;
  });
  res.end(JSON.stringify(notifications));
});

if (config.connectionType === 'keycloak') {
  appUI.get('/ui/keycloak/roles', protect(config), cors(corsOptions), async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // req.kauth.grant.access_token.content.realm_access resource_access .roles
    if (!req.kauth
        && !req.kauth.grant
        && !req.kauth.grant.access_token
        && !req.kauth.grant.access_token.content) {
      throw new Error('Only Keycloak access is allowed');
    }
    const roles = [];
    const { content } = req.kauth.grant.access_token;
    if (content.realm_access && content.realm_access.roles) {
      content.realm_access.roles.forEach((r) => {
        roles.push(`realm:${r}`);
      });
    }
    if (content.resource_access) {
      Object.keys(content.resource_access).forEach((clientId) => {
        const clientRoles = content.resource_access[clientId].roles;
        if (clientRoles) {
          clientRoles.forEach((r) => {
            roles.push(`${clientId}:${r}`);
          });
        }
      });
    }
    res.end(JSON.stringify(roles));
  });
}

startApplication();
startSMSApplication();
appUI.listen(uiPort, () => {
  logger.info(`HTTP smartthings phevctl UI listening on port ${uiPort}`);
  installCrons();
});

process.on('exit', async () => {
  await killAll();
  appUI.close();
});
