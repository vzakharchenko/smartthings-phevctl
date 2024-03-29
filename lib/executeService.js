const { exec } = require('child_process');

const { offDeviceFromSmartThings } = require('./smartthings');
const { logger } = require('./logger');
const { saveConfig } = require('./env');

const lastMessage = {
};

const lockRequest = {
  locked: false,
  data: 0,
  weight: -1,
};

setTimeout(() => {
  if (lockRequest.locked) {
    if ((Date.now() - lockRequest.data) > 1000 * 60 * 5) {
      console.log('force unlocked');
      lockRequest.locked = false;
      lockRequest.data = 0;
      lockRequest.weight = -1;
    }
  }
}, 3000);

const messageResponse = {
  batteryWarning: (messageId) => (messageId ? Number(messageId) : null),
  battery: (messageId) => (messageId && messageId > 0 ? messageId : null),
  theftStatus: (messageId) => (messageId ? Number(messageId) : null),
  preaccont: (messageId) => (messageId ? Number(messageId) : null),
  errACinfo: (messageId) => messageId,
  errCHGinfo: (messageId) => messageId,
  errTimerinfo: (messageId) => messageId,
};

async function smartthingsOffDevice(deviceId, readConfig) {
  const { smartthings } = readConfig;
  if (smartthings.useSmartthings) {
    const status = await offDeviceFromSmartThings(
      smartthings.shard,
      smartthings.appId,
      smartthings.appSecret,
      deviceId,
    );
    return status;
  }
  return null;
}

const actionToCommands = {
  forceUpdate: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} update`,
  hvac: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} hvac| grep operating`,
  doors: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} lockstatus| grep Doors`,
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
  batteryWarning: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} warning| grep "Warning message"`,
  errACinfo: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} airconerror| grep "air conditioning"`,
  errCHGinfo: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} chargeerror| grep charge`,
  errTimerinfo: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} aircontimererror| grep "air conditioning timer"`,
  theftStatus: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} theftstatus| grep "theft alarm"`,
  preaccont: (readConfig) => `phevctl ${readConfig.macAddress ? `-m "${readConfig.macAddress}"` : ''} preaccont| grep "Pre air conditioning control"`,
  evseSlow: () => 'slowCharge.sh',
  evseFastCharge: () => 'fastCharge.sh',
  evseDisableCharge: () => 'disableCharge.sh',
  reboot: () => 'reboot',
  halt: () => 'halt',
  upgrade: () => 'nohup npm i smartthings-phevctl -g >/dev/null 2>1 &',
  shutdown2H: (readConfig) => {
    // eslint-disable-next-line no-param-reassign
    readConfig.upsMaxTimeHours = '2';
    saveConfig(readConfig);
    return null;
  },
  shutdown5H: (readConfig) => {
    // eslint-disable-next-line no-param-reassign
    readConfig.upsMaxTimeHours = '5';
    saveConfig(readConfig);
    return null;
  },
  shutdown8H: (readConfig) => {
    // eslint-disable-next-line no-param-reassign
    readConfig.upsMaxTimeHours = '8';
    saveConfig(readConfig);
    return null;
  },
  shutdown1D: (readConfig) => {
    // eslint-disable-next-line no-param-reassign
    readConfig.upsMaxTimeHours = '24';
    saveConfig(readConfig);
    return null;
  },
  shutdown2D: (readConfig) => {
    // eslint-disable-next-line no-param-reassign
    readConfig.upsMaxTimeHours = '48';
    saveConfig(readConfig);
    return null;
  },
};

const transformResponse = {
  battery: (response, config) => {
    logger.info(`battery response = ${response}`);
    let resp = {};
    if (response) {
      try {
        resp = JSON.parse(response);
      } catch (e) {
        logger.warn(e);
      }
      return { value: (resp['Battery level'] * (config.batteryFactory || 1.0)).toFixed(0), value2: resp.heater };
    }
    return null;
  },
  charging: (response) => response.replace(/[^0-9]/g, ''),
  batteryWarning: (response) => response.replace(/[^0-9]/g, ''),
  theftStatus: (response) => response.replace(/[^0-9]/g, ''),
  errACinfo: (response) => response.includes('air conditioning error'),
  preaccont: (response) => response.replace(/[^0-9]/g, ''),
  errCHGinfo: (response) => response.includes('charge error'),
  errTimerinfo: (response) => response.includes('air conditioning timer error'),
  doors: (response) => {
    logger.info(`response "${response}"`);
    if (response.includes('Doors are Locked')) {
      return 1;
    } if (response === 'Doors are UnLocked \n') {
      return 0;
    }
    return -1;
  },
  hvac: (response) => {
    logger.info(`hvac response = ${response}`);
    let resp = {};
    if (response) {
      try {
        resp = JSON.parse(response);
      } catch (e) {
        logger.warn(e);
      }
    }
    return { value: resp.operating, value2: resp.mode };
  },
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function execute0(device, readConfig) {
  return new Promise((resolve) => {
    const command = actionToCommands[device.actionId](readConfig, device);
    if (!command) {
      resolve({ code: 0, output: null });
      return;
    }
    logger.info(`run command ${command}`);
    let scriptOutput = '';
    const child = exec(command);
    let answered = false;
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
      answered = true;
      resolve({ code, output: (output ? output(scriptOutput, readConfig) : null) });
    });
    // Kill after "x" milliseconds
    setTimeout(() => {
      child.kill();
      if (!answered) {
        logger.info(`${device.id} force killed`);
        const output = transformResponse[device.actionId];
        resolve({ code: -1, output: (output ? output(scriptOutput, readConfig) : null) });
      }
    }, readConfig.smartthings.timeout);
  });
}

function killAll() {
  return new Promise((resolve) => {
    logger.info('run command killall phevctl');
    const child = exec('killall phevctl');
    child.on('close', (code) => {
      resolve(code);
    });
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
  if (lockRequest.weight < 3) {
    lockRequest.weight = 3;
  }
  while (lockRequest.weight <= 3 && lockRequest.locked) {
    await sleep(2000);
  }
  lockRequest.weight = 3;
  lockRequest.locked = true;
  lockRequest.data = Date.now();
  try {
    try {
      if (!device.direct) {
        await smartthingsOffDevice(device.id, readConfig);
      }
    } catch (e) {
      logger.error('Smartthing off device error', e);
    }
    await killAll();
    let res = await execute0(device, readConfig);
    if (res.code !== 0) {
      await sleep(6000);
      await killAll();
      res = await execute0(device, readConfig);
    }
    if (res.code === 0) {
      return res.output;
    }
  } catch (e) {
    logger.error(e.message, e);
  } finally {
    lockRequest.locked = false;
    lockRequest.weight = -1;
  }
  return null;
}

async function forceUpdate(readConfig) {
  if (lockRequest.weight < 2) {
    lockRequest.weight = 2;
  }
  while (lockRequest.weight <= 2 && lockRequest.locked) {
    await sleep(2000);
  }
  lockRequest.weight = 2;
  lockRequest.locked = true;
  lockRequest.data = Date.now();
  try {
    const device = {
      id: 'forceUpdate',
      actionId: 'forceUpdate',
    };
    await killAll();
    let res = await execute0(device, readConfig);
    if (res.code !== 0) {
      await sleep(6000);
      await killAll();
      res = await execute0(device, readConfig);
    }
    if (res.code === 0) {
      return res.output;
    }
  } catch (e) {
    logger.error(e.message, e);
  } finally {
    lockRequest.locked = false;
    lockRequest.weight = -1;
  }
  return null;
}

async function getNotificationByActionId(actionId, readConfig) {
  if (lockRequest.weight < 1) {
    lockRequest.weight = 1;
  }
  while (lockRequest.weight <= 1 && lockRequest.locked) {
    await sleep(2000);
  }
  lockRequest.weight = 1;
  lockRequest.locked = true;
  lockRequest.data = Date.now();
  try {
    const device = {
      id: actionId,
      actionId,
    };
    await killAll();
    let res = await execute0(device, readConfig);
    if (res.code !== 0) {
      await sleep(3000);
      await killAll();
      res = await execute0(device, readConfig);
    }
    if (res.code === 0) {
      const messageId = res.output;
      if (messageId === lastMessage[actionId]) {
        return null;
      }
      const value = messageId.value2 === 0 || messageId.value2
        ? messageId.value2
        : messageId;
      lastMessage[actionId] = value;
      return messageResponse[actionId](value);
    }
  } catch (e) {
    logger.error(e.message, e);
  } finally {
    lockRequest.locked = false;
    lockRequest.weight = -1;
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
module.exports.executeActionDirect = execute;
module.exports.forceUpdate = forceUpdate;
module.exports.killAll = killAll;
module.exports.sleep = sleep;
module.exports.getNotificationByActionId = getNotificationByActionId;
