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
  charging: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} chargestatus | grep "Charge status"`,
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
  battery: (response, config) => (response.replace(/[^0-9]/g, '') * (config.batteryFactory || 1.0)).toFixed(0),
  charging: (response) => response.replace(/[^0-9]/g, ''),
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function execute0(device, readConfig) {
  return new Promise((resolve) => {
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
      resolve({ code, output: (output ? output(scriptOutput, readConfig) : null) });
    });
    // Kill after "x" milliseconds
    setTimeout(() => {
      child.kill();
      logger.info(`${device.id} force killed`);
      const output = transformResponse[device.actionId];
      resolve({ code: -1, output: (output ? output(scriptOutput, readConfig) : null) });
    }, readConfig.smartthings.timeout);
  });
}
function restartApplication() {
  return new Promise((resolve) => {
    logger.info('run command pm2 restart smartthings-phevctl');
    const child = exec('pm2 restart smartthings-phevctl');
    child.stdout.on('data', (data) => {
      logger.info(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      logger.error(`stderr: ${data}`);
    });
    child.on('close', (code) => {
      logger.info(`closing code: ${code}`);
      resolve(code);
    });
    // Kill after "x" milliseconds
    setTimeout(() => {
      child.kill();
      logger.info('restart force killed');
      resolve(-1);
    }, 10000);
  });
}
async function execute(device, readConfig) {
  try {
    let res = await execute0(device, readConfig);
    if (res.code !== 0) {
      await sleep(3000);
      res.code = await execute0(device, readConfig);
      if (res.code !== 0) {
        await sleep(3000);
        res = await execute0(device, readConfig);
      }
    }
    if (res.code === 0) {
      return res.output;
    }
  } catch (e) {
    logger.error(e.message, e);
  } finally {
    await smartthingsOffDevice(device.id, readConfig);
  }
  return null;
}
async function execute1(deviceId, readConfig) {
  const device = readConfig.smartthings.devices.find((d) => d.id === deviceId);
  if (device) {
    return execute(device, readConfig);
  }
  return null;
}

async function execute2(deviceId, action2, readConfig) {
  const device = readConfig.smartthings.devices.find((d) => d.id === deviceId);
  if (device) {
    const value = await execute(device, readConfig);
    const device2 = JSON.parse(JSON.stringify(device));
    device2.actionId = action2;
    const value2 = await execute(device2, readConfig);
    return { value, value2 };
  }
  return null;
}

module.exports.restartApplication = restartApplication;
module.exports.executeAction = execute1;
module.exports.executeAction2 = execute2;
