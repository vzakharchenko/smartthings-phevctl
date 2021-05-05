const express = require('express');

const cors = require('cors');
const { fetchData, sendData } = require('./lib/restCalls');
const { readEVSEConfig } = require('./lib/env');

const { logger } = require('./lib/logger');

const {
  connectAuthentication, protect,
} = require('./authenticationConnection');

const appUI = express();

appUI.set('trust proxy', () => true);

const corsOptions = {
  origin(o, callback) {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  credentials: true,
  maxAge: 3600,
};
const evseConfig = readEVSEConfig();

appUI.use(cors(corsOptions));

connectAuthentication(appUI, evseConfig);

appUI.get('/*', protect(evseConfig), cors(corsOptions), async (req, res) => {
  const curConfig = readEVSEConfig();
  try {
    let path = '/';
    if (req.originalUrl !== '/') {
      path = req.originalUrl[0] === '/' ? req.originalUrl.substring(1) : req.originalUrl;
    }
    const url = curConfig.evseServer[path];
    const resp = await fetchData(`${url || (curConfig.evseServer['/'] + req.originalUrl)}`);
    res.status(200).send(resp.data);
  } catch (e) {
    logger.error(e);
    res.status(200).send(e);
  }
});

function bodyToText(body) {
  return Object.keys(body).map((k) => `${k}=${body[k]}`).join('&');
}
appUI.post('/*', protect(evseConfig), cors(corsOptions), async (req, res) => {
  const curConfig = readEVSEConfig();
  try {
    let path = '/';
    if (req.originalUrl !== '/') {
      path = req.originalUrl[0] === '/' ? req.originalUrl.substring(1) : req.originalUrl;
    }
    const url = curConfig.evseServer[path];
    const resp = await sendData(`${url || (curConfig.evseServer['/'] + req.originalUrl)}`, 'POST', bodyToText(req.body));
    res.status(200).send(resp.data);
  } catch (e) {
    logger.error(e);
    res.status(200).send(e);
  }
});

appUI.listen(evseConfig.port || 8011, () => {
  logger.info(`HTTP smartthings phevctl UI listening on port ${evseConfig.port || 8011}`);
});
