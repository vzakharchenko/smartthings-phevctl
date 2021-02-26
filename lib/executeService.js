const { exec } = require('child_process');
const { smartthingsOffDevice } = require('./smartthingsConnection');

const actionToCommands = {
  airconOn: (readConfig) => `phevctl -m "${readConfig.macAddress}" aircon on`,
  airconOff: (readConfig) => `phevctl -m "${readConfig.macAddress}" aircon off`,
  headlightsOn: (readConfig) => `phevctl -m "${readConfig.macAddress}" headlights on`,
  headlightsOff: (readConfig) => `phevctl -m "${readConfig.macAddress}" headlights off`,
  parkinglightsOn: (readConfig) => `phevctl -m "${readConfig.macAddress}" parkinglights on`,
  parkinglightsOff: (readConfig) => `phevctl -m "${readConfig.macAddress}" parkinglights off`,
  cooling10Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode cool 10`,
  cooling20Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode cool 20`,
  cooling30Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode cool 30`,
  windscreen10Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode windscreen 10`,
  windscreen20Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode windscreen 20`,
  windscreen30Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode windscreen 30`,
  heating10Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode heat 10`,
  heating20Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode heat 20`,
  heating30Mins: (readConfig) => `phevctl -m "${readConfig.macAddress}" acmode heat 30`,
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
      const child = exec(actionToCommands[device.actionId](readConfig));
      child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });
      child.on('close', (code) => {
        console.log(`closing code: ${code}`);
        resolve(code);
      });
      // Kill after "x" milliseconds
      setTimeout(() => {
        child.kill();
        console.error(`${deviceId} force killed`);
        resolve(-1);
      }, 60000 * 5);
    } else {
      resolve(0);
    }
  });
}
async function execute(deviceId, readConfig) {
  if (working === 1) {
    if (timeout && (Date.now() > timeout + 1000 * 60 * 10)) {
      timeout = null;
      working = 0;
    } else {
      if (!timeout) {
        timeout = Date.now();
      }
      await smartthingsOffDevice(deviceId);
      throw new Error('Already  working');
    }
  }
  working = 1;
  timeout = Date.now();
  try {
    let code = await execute0(deviceId, readConfig);
    if (code !== 0) {
      await sleep(3000);
      code = await execute0(deviceId, readConfig);
      if (code !== 0) {
        await sleep(3000);
        await execute0(deviceId, readConfig);
      }
    }
  } catch (e) {
    console.error(e.message, e);
  } finally {
    working = 0;
    timeout = null;
    await smartthingsOffDevice(deviceId);
  }
}

module.exports.executeAction = execute;
