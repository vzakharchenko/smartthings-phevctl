const express = require('express');
const bodyParser = require('body-parser');
const { readConfig } = require('./env');
const { executeAction } = require('./executeService');
const { smartthingsOffDevice } = require('./smartthingsConnection');

let server;
let working;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function startApplication() {
  const config = readConfig();
  if (config.smartthings.appId && config.smartthings.appSecret) {
    if (server) {
      server.close();
    }

    const app = express();

    app.use(bodyParser.json());

    app.get(`/${config.smartthings.appId}/${config.smartthings.appSecret}/execute`, async (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const { deviceId } = req.query;
      if (working === 1) {
        res.end(JSON.stringify({ status: 'OK' }));
        return;
      }
      working = 1;
      try {
        let code = await executeAction(deviceId, readConfig());
        if (code !== 0) {
          await sleep(3000);
          code = await executeAction(deviceId, readConfig());
          if (code !== 0) {
            await sleep(3000);
            await executeAction(deviceId, readConfig());
          }
        }
      } finally {
        working = 0;
        await smartthingsOffDevice(deviceId);
      }
      res.end(JSON.stringify({ status: 'OK' }));
    });

    server = app.listen(config.port, () => {
      console.info(`HTTP smartthings phevctl listening on port ${config.port}`);
    });
  }
}

module.exports.startApplication = startApplication;
