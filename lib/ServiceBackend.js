const express = require('express');
const bodyParser = require('body-parser');
const { smartthingsOffDevice } = require('./smartthingsConnection');
const { updateSmartthingsDevices } = require('./smartthingsConnection');
const { logger } = require('./logger');
const { readConfig } = require('./env');
const { executeAction } = require('./executeService');

let server;

function startApplication() {
  const config = readConfig();
  if (config.smartthings.appId && config.smartthings.appSecret) {
    if (server) {
      server.close();
    }

    const app = express();

    app.use(bodyParser.json());

    app.get(`/${config.smartthings.appId}/${config.smartthings.appSecret}/execute`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const { deviceId } = req.query;
      const rc = readConfig();
      const device = rc.smartthings.devices.find((d) => d.id === deviceId);
      if (device && device.actionId === 'forceUpdate') {
        updateSmartthingsDevices().then(() => {
          logger.info(`${deviceId} successfully executed`);
          smartthingsOffDevice(device.id).then();
        }).catch(() => {
          logger.error(`${deviceId} failed to execute`);
          smartthingsOffDevice(device.id).then();
        });
        res.end(JSON.stringify({ status: 'OK' }));
      } else {
        executeAction(deviceId, rc).then(() => {
          logger.info(`${deviceId} successfully executed`);
        }).catch(() => {
          logger.error(`${deviceId} failed to execute`);
        });
        res.end(JSON.stringify({ status: 'OK' }));
      }
    });

    server = app.listen(config.port, () => {
      logger.info(`HTTP smartthings phevctl listening on port ${config.port}`);
    });
  }
}

module.exports.startApplication = startApplication;
