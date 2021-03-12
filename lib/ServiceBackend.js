const express = require('express');
const bodyParser = require('body-parser');
const { forceUpdate } = require('./executeService');
const { smartthingsUpdateDevice } = require('./smartthingsConnection');
const { smartthingsOffDevice } = require('./smartthingsConnection');
const { updateSmartthingsDevices } = require('./smartthingsConnection');
const { logger } = require('./logger');
const { readConfig } = require('./env');
const { executeAction } = require('./executeService');

let server;

function executeActionRes(rc, device) {
  if (device && device.actionId === 'forceUpdate') {
    updateSmartthingsDevices().then(() => {
      logger.info(`${device.deviceLabel} successfully executed`);
      smartthingsOffDevice(device.id).then();
    }).catch(() => {
      logger.error(`${device.deviceLabel} failed to execute`);
      smartthingsOffDevice(device.id).then();
    });
  } else {
    const promise = executeAction(device.id, rc);
    if (promise) {
      promise.then(async () => {
        if (device && device.hvacUpdatable) {
          setTimeout(async () => {
            logger.info(`execute hvac for ${device.deviceLabel}`);
            if (rc.smartthings.executeUpdate) {
              logger.info(`force Update for ${device.deviceLabel}`);
              await forceUpdate(rc);
            }
            const hvacDevices = rc.smartthings.devices.filter((d) => d.actionId === 'hvac');
            const hvacDevicesPromises = [];
            hvacDevices.forEach((hvac) => {
              if (device && device.hvacUpdatable) {
                hvacDevicesPromises.push(smartthingsUpdateDevice(hvac));
              }
            });
            await Promise.all(hvacDevicesPromises);
          }, 3000);
        }
        logger.info(`${device.deviceLabel} successfully executed`);
      }).catch(() => {
        logger.error(`${device.deviceLabel} failed to execute`);
      });
    }
  }
}

function startApplication() {
  const config = readConfig();
  if (config.smartthings.appId && config.smartthings.appSecret) {
    if (server) {
      server.close();
    }

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.text());

    app.get(`/${config.smartthings.appId}/${config.smartthings.appSecret}/execute`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const { deviceId } = req.query;
      const rc = readConfig();
      const device = rc.smartthings.devices.find((d) => d.id === deviceId);
      executeActionRes(rc, device);
      res.end(JSON.stringify({ status: 'OK' }));
    });

    if (config.smartthings.sms && config.smartthings.sms.enabled) {
      app.get(`/${config.smartthings.appId}/${config.smartthings.appSecret}/sms`, (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const rc = readConfig();
        const { command } = req.query;
        const commands = command.split(' ');
        if (commands.length !== 2) {
          res.end('Wrong command format');
          return;
        }
        const smsPassword = commands[0];
        const actionId = commands[1];

        if (smsPassword !== rc.smartthings.sms.password) {
          res.end('Wrong password');
          return;
        }
        const actionIds = Array.from(new Set(rc.smartthings.devices
          .filter((d) => !d.updatable)
          .map((d) => d.actionId)));
        if (actionId === 'help') {
          res.end(`format: <password> [${actionIds.join('/')}]`);
          return;
        }
        if (!actionIds.includes(actionId)) {
          res.end(`${actionId} does not supported`);
          return;
        }
        const device = rc.smartthings.devices.find((d) => d.actionId === actionId);
        executeActionRes(rc, device);
        res.end(JSON.stringify(`${actionId} executed`));
      });
    }

    server = app.listen(config.port, () => {
      logger.info(`HTTP smartthings phevctl listening on port ${config.port}`);
    });
  }
}

module.exports.startApplication = startApplication;
