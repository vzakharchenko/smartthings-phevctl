const fs = require('fs');
const { restartApplication } = require('./executeService');
const { smartthingsCheck } = require('./smartthingsConnection');
const { saveConfig } = require('./env');
const { readConfig } = require('./env');

async function checkSmartthings(req, res) {
  const { appId } = req.query;
  const { secret } = req.query;
  const curConfig = readConfig();
  const shardContainer = await smartthingsCheck(appId, secret);
  if (shardContainer) {
    curConfig.smartthings.shard = shardContainer.shard;
    curConfig.smartthings.appId = appId;
    curConfig.smartthings.appSecret = secret;
    curConfig.smartthings.useCloud = shardContainer.useCloud;
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  } else {
    res.end(JSON.stringify({ status: 'Fail', message: 'Application or Shard does not found' }));
  }
}

async function saveKeycloakJson(req, res) {
  const keycloakJson = req.body;
  const keycloakJsonFile = `${process.env.HOME}/.remote-ctrl-gsm/keycloak.json`;
  let message = '';
  let json;
  try {
    json = JSON.parse(keycloakJson.keycloakJson);
  } catch (e) {
    message = e.message;
  }
  if (!message) {
    if (!json.realm) {
      message = 'realm is not specified inside keycloak.json';
    } else if (!json['auth-server-url']) {
      message = 'auth-server-url is not specified inside keycloak.json';
    } else if (!json.resource) {
      message = 'resource is not specified inside keycloak.json';
    } else if (!json.credentials) {
      message = 'credentials is not specified inside keycloak.json';
    } else if (!json.credentials.secret) {
      message = 'credentials is not specified inside keycloak.json';
    }
  }
  if (message) {
    res.end(JSON.stringify({ status: 'Fail', message }));
  } else {
    fs.writeFileSync(keycloakJsonFile, keycloakJson.keycloakJson, 'UTF-8');
    await restartApplication();
    res.end(JSON.stringify({ status: 'OK' }));
  }
}

module.exports.checkSmartthings = checkSmartthings;
module.exports.saveKeycloakJson = saveKeycloakJson;
