const { exec } = require('child_process');
const { offDeviceFromSmartThings } = require('./smartthings');
const { logger } = require('./logger');

async function smartthingsOffDevice(deviceId, readConfig) {
  const { smartthings } = readConfig;
  const status = await offDeviceFromSmartThings(smartthings.shard,
    smartthings.appId,
    smartthings.appSecret, deviceId);
  return status;
}

const actionToCommands = {
  battery: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} battery | grep "Battery level"`,
  airconOn: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} aircon on`,
  airconOff: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} aircon off`,
  headlightsOn: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} headlights on`,
  headlightsOff: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} headlights off`,
  parkinglightsOn: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} parkinglights on`,
  parkinglightsOff: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} parkinglights off`,
  cooling10Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode cool 10`,
  cooling20Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode cool 20`,
  cooling30Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode cool 30`,
  windscreen10Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode windscreen 10`,
  windscreen20Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode windscreen 20`,
  windscreen30Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode windscreen 30`,
  heating10Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode heat 10`,
  heating20Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode heat 20`,
  heating30Mins: (readConfig, device) => `phevctl ${device.modelYear && device.modelYear !== 'any' ? `--car-model=${device.modelYear}` : ''} ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} acmode heat 30`,
};

const transformResponse = {
  battery: (response) => response.replace(/[^0-9]/g, ''),
};

let working;
let timeout;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function execute0(deviceId, readConfig) {
  return new Promise((resolve) => {
    const device = readConfig.smartthings.devices.find((d) => d.id === deviceId);
    if (device) {
      const command = actionToCommands[device.actionId](readConfig, device);
      logger.info(`run command ${command}`);
      let scriptOutput = '';
      const child = exec(command);
      child.stdout.on('data', (data) => {
        logger.info(`stdout: ${data}`);
        scriptOutput += data.toString();
      });

      child.stderr.on('data', (data) => {
        logger.error(`stderr: ${data}`);
      });
      child.on('close', (code) => {
        logger.info(`closing code: ${code}`);
        const output = transformResponse[device.actionId];
        resolve({ code, output: (output ? output(scriptOutput) : null) });
      });
      // Kill after "x" milliseconds
      setTimeout(() => {
        child.kill();
        logger.info(`${deviceId} force killed`);
        resolve(-1);
      }, readConfig.smartthings.timeout);
    } else {
      resolve(0);
    }
  });
}
async function execute(deviceId, readConfig) {
  if (working === 1) {
    if (timeout && (Date.now() > timeout + readConfig.smartthings.timeout * 3)) {
      timeout = null;
      working = 0;
    } else {
      if (!timeout) {
        timeout = Date.now();
      }
      await smartthingsOffDevice(deviceId, readConfig);
      throw new Error('Already  working');
    }
  }
  working = 1;
  timeout = Date.now();
  try {
    let res = await execute0(deviceId, readConfig);
    if (res.code !== 0) {
      await sleep(3000);
      res.code = await execute0(deviceId, readConfig);
      if (res.code !== 0) {
        await sleep(3000);
        res = await execute0(deviceId, readConfig);
      }
    }
    if (res.code === 0) {
      return res.output;
    }
  } catch (e) {
    logger.error(e.message, e);
  } finally {
    working = 0;
    timeout = null;
    await smartthingsOffDevice(deviceId, readConfig);
  }
  return null;
}

module.exports.executeAction = execute;
