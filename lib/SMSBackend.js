const express = require('express');
const bodyParser = require('body-parser');
const mkdirp = require('mkdirp');
const fs = require('fs');
const { executeActionDirect } = require('./executeService');
const { logger } = require('./logger');
const { readConfig } = require('./env');

let server;

const FILE_PATH = `${process.env.HOME}/.remote-ctrl-gsm/.sms.txt`;
mkdirp.sync(`${process.env.HOME}/.remote-ctrl-gsm`);

const defaultmessageJSON = { message1: '', message2: '' };

function readmessageJSON() {
  let message = defaultmessageJSON;
  if (fs.existsSync(FILE_PATH)) {
    const text = fs.readFileSync(FILE_PATH, 'utf-8');
    if (text) {
      message = JSON.parse(text);
    }
  }
  return message;
}

function readmessage(messageId = 1) {
  const messageJSON = readmessageJSON();
  return messageId === 2 ? messageJSON.message2 : messageJSON.message1;
}

function savemessageJSON(text, messageId = 1) {
  const newMessage = {
    ...readmessageJSON(),
    ...(messageId === 2 ? { message2: text } : { message1: text }),
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(newMessage, null, 1), 'UTF-8');
}

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
    savemessageJSON(notification, 1);
  }
}

function addSMS2(notification, config) {
  if (config.smartthings.sms && config.smartthings.sms.enabled
     && config.smartthings.sms.sendSMSNotification) {
    savemessageJSON(notification, 2);
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
          logger.error(`Wrong SMS: ${command}`);
          res.end('');
          return;
        }
        const phev = commands[0];
        const smsPassword = commands[1];
        const actionId = commands[2];

        if (phev !== 'phev' && phev !== 'Phev') {
          logger.error(`Wrong SMS: ${command}`);
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
          modelYear: rc.smartthings.sms.smsCar,
          deviceLabel: `sms ${actionId}`,
        };
        executeActionRes(rc, device);
        res.end(`${actionId} is executing`);
      });
    }

    app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/message1`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });

      const message = readmessage(1);
      res.end(message);
      if (message) {
        logger.info(`SMS "${message}" sent (1)`);
        savemessageJSON('', 1);
      }
    });

    app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/message2`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      const message = readmessage(2);
      res.end(message);
      if (message) {
        logger.info(`SMS "${message}" sent (2)`);
        savemessageJSON('', 2);
      }
    });

    app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/test1`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      addSMS1('testMessage1', readConfig());
      res.end('OK');
    });

    app.get(`/${config.smartthings.sms.appId}/${config.smartthings.sms.secret}/test2`, (req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      addSMS1('testMessage1', readConfig());
      res.end('OK');
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
