const { exec } = require('child_process');
const { logger } = require('./logger');
const { readConfig } = require('./env');
const { sleep } = require('./executeService');

let upsInfo = {
  loadVoltage: undefined,
  current: undefined,
  power: undefined,
  percent: undefined,
  timeToShutDown: undefined,
};

function execute(command) {
  return new Promise((resolve) => {
    logger.info(`run command ${command}`);
    let scriptOutput = '';
    const child = exec(command);
    let answered = false;
    child.stdout.on('data', (data0) => {
      logger.info(`stdout: ${data0}`);
      scriptOutput += data0.toString();
    });

    child.stderr.on('data', (data0) => {
      logger.error(`stderr: ${data0}`);
    });
    child.on('close', (code) => {
      logger.info(`closing code: ${code}`);
      logger.info(`Output: ${scriptOutput}`);
      answered = true;
      resolve(scriptOutput);
    });
    // Kill after "x" milliseconds
    setTimeout(() => {
      child.kill();
      if (!answered) {
        logger.info('halt force killed');
        resolve();
      }
    }, 10000);
  });
}

async function halt() {
  await execute('halt');
}

async function data() {
  const text = await execute('/opt/ups/ups.sh');
  return text ? JSON.parse(text) : null;
}

async function uptimeInMiliseconds() {
  const text = await execute('awk \'{print $1*1000}\' /proc/uptime');
  return parseInt(text, 10);
}

async function timeToShutDown() {
  const rc = readConfig();
  const upsMaxTimeHours = rc.upsMaxTimeHours || '8';
  const uptime = await uptimeInMiliseconds();
  const number = (parseInt(upsMaxTimeHours, 10) * 60 * 60 * 1000) - uptime;
  return number < 0 ? 0 : number;
}

async function haltIfneeded() {
  const rc = readConfig();
  const uptime = await uptimeInMiliseconds();
  if (!uptime) {
    return;
  }
  if (!rc.ups || rc.ups === 'none') {
    return;
  }
  const upsMaxTimeHours = rc.upsMaxTimeHours || '8';
  if (uptime > (parseInt(upsMaxTimeHours, 10) * 60 * 60 * 1000)) {
    await halt();
  } else {
    let currentValue = await data();
    if (!currentValue) {
      upsInfo = currentValue;
      console.error('Current ups does not exists');
    } else if (currentValue.current < 0) {
      await sleep(3000);
      currentValue = await data();
      if (currentValue.current < 0) {
        await sleep(5000);
        currentValue = await data();
        if (currentValue.current < 0) {
          await halt();
        }
      }
    }
  }
}

module.exports.haltIfneeded = haltIfneeded;
module.exports.upsInfo = upsInfo;
module.exports.timeToShutDown = timeToShutDown;
