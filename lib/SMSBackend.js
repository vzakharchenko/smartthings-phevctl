const express = require('express');
const bodyParser = require('body-parser');
const { executeActionDirect } = require('./executeService');
const { logger } = require('./logger');
const { readConfig } = require('./env');

let server;

let message1 = '';
let message2 = '';

const supportedSMSCommands = [
  'cooling10Mins',
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
  'headlightsOn',
  'headlightsOff',
  'parkinglightsOn',
  'parkinglightsOff',
];

function executeActionRes(rc, device) {
  executeActionDirect(device, rc).then();
}

function addSMS1(notification, config) {
  if (config.smartthings.sms && config.smartthings.sms.enabled
     && config.smartthings.sms.sendSMSNotification) {
    message1 = notification;
  }
}

function addSMS2(notification, config) {
  if (config.smartthings.sms && config.smartthings.sms.enabled
     && config.smartthings.sms.sendSMSNotification) {
    message2 = notification;
  }
}

function startSMSApplication() {
  const config = readConfig();
  if (config.smartthings.sms
      && config.smartthings.sms.enabled
      && config.smartthings.sms.appId
      && config.smartthings.sms.secret
  ) {
    if (server) {
      server.close();
    }

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.text());

    if (config.smartthings.sms && config.smartthings.sms.enabled) {
      app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/sms`, (req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const rc = readConfig();
        const { command } = req.query;
        const commands = command.split(' ');
        if (commands.length !== 3) {
          res.end('Wrong command format');
          return;
        }
        const phev = commands[0];
        const smsPassword = commands[1];
        const actionId = commands[2];

        if (phev !== 'phev' && phev !== 'Phev') {
          res.end('');
          return;
        }

        if (smsPassword !== rc.smartthings.sms.password) {
          res.end('Wrong password');
          return;
        }
        if (!supportedSMSCommands.includes(actionId)) {
          res.end(`${actionId} does not supported`);
          return;
        }

        const device = {
          id: actionId,
          direct: true,
          actionId,
          deviceLabel: `sms ${actionId}`,
        };
        executeActionRes(rc, device);
        res.end(`${actionId} executed`);
      });
    }

    app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/message1`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(message1);
      message1 = '';
    });

    app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/message2`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(message2);
      message2 = '';
    });

    server = app.listen(config.portSMS, () => {
      logger.info(`HTTP SMS phevctl listening on port ${config.portSMS}`);
    });
  }
}

module.exports.startSMSApplication = startSMSApplication;
module.exports.supportedSMSCommands = supportedSMSCommands;
module.exports.addSMSNotification1 = addSMS1;
module.exports.addSMSNotification2 = addSMS2;
