const express = require('express');
const bodyParser = require('body-parser');
const { forceUpdate } = require('./executeService');
const { executeActionRes } = require('./smartthingsConnection');
const { logger } = require('./logger');
const { readConfig } = require('./env');

let server;

function startApplication() {
  const config = readConfig();
  if (config.smartthings.appId && config.smartthings.appSecret) {
    if (server) {
      server.close();
    }

    const app = express();
    app.set('trust proxy', () => true);
    app.use(bodyParser.json());
    app.use(bodyParser.text());

    app.get(`/${config.smartthings.appId}/${config.smartthings.appSecret}/execute`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const { deviceId } = req.query;
      const rc = readConfig();
      const device = rc.smartthings.devices.find((d) => d.id === deviceId);
      if (rc.smartthings.executeUpdate) {
        logger.info(`force Update for ${device.deviceLabel}`);
        forceUpdate(rc).then(() => {
          executeActionRes(rc, device);
        });
      } else {
        executeActionRes(rc, device);
      }

      res.end(JSON.stringify({ status: 'OK' }));
    });

    server = app.listen(config.port, () => {
      logger.info(`HTTP smartthings phevctl listening on port ${config.port}`);
    });
  }
}

module.exports.startApplication = startApplication;
