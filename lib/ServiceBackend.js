const express = require('express');
const bodyParser = require('body-parser');
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
      executeAction(deviceId, readConfig()).then(() => {
        logger.info(`${deviceId} successfully executed`);
      }).catch(() => {
        logger.error(`${deviceId} failed to execute`);
      });
      res.end(JSON.stringify({ status: 'OK' }));
    });

    server = app.listen(config.port, () => {
      logger.info(`HTTP smartthings phevctl listening on port ${config.port}`);
    });
  }
}

module.exports.startApplication = startApplication;
