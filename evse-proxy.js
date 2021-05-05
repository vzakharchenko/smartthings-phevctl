const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
const { fetchData, sendData } = require('./lib/restCalls');
const { readEVSEConfig } = require('./lib/env');

const { logger } = require('./lib/logger');

const {
  connectAuthentication, protect,
} = require('./authenticationConnection');

const appUI = express();
appUI.use(bodyParser.urlencoded({ extended: true }));

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
    if (req.params[0] !== '') {
      path = req.params[0] === '/' ? req.params[0].substring(1) : req.params[0];
    }
    let query = '';
    if (req.query) {
      query = Object.keys(req.query).map((k) => `${k}=${req.query[k]}`).join('&');
    }
    const url = curConfig.evseServer[path];
    const resp = await fetchData(`${url || (`${curConfig.evseServer['/']}/${path}`)}${query ? `?${query}` : ''}`);
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
    if (req.params[0] !== '') {
      path = req.params[0] === '/' ? req.params[0].substring(1) : req.params[0];
    }
    let query = '';
    if (req.query) {
      query = Object.keys(req.query).map((k) => `${k}=${req.query[k]}`).join('&');
    }
    const url = curConfig.evseServer[path];
    const resp = await sendData(`${url || (`${curConfig.evseServer['/']}/${path}`)}${query ? `?${query}` : ''}`,
      'POST', bodyToText(req.body));
    res.status(200).send(resp.data);
  } catch (e) {
    logger.error(e);
    res.status(200).send(e);
  }
});

appUI.listen(evseConfig.port || 8011, () => {
  logger.info(
    `HTTP smartthings phevctl UI listening on port ${evseConfig.port || 8011}`,
  );
});
