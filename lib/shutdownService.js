const { promises, existsSync } = require('fs');
const { exec } = require('child_process');
const { logger } = require('./logger');
const { readConfig } = require('./env');

let startedTime = null;

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

async function readStartedDate() {
  if (!startedTime) {
    if (existsSync('/tmp/ups')) {
      const upsDate = await promises.readFile('/tmp/ups', 'utf-8');
      startedTime = parseInt(upsDate, 10);
    } else {
      startedTime = Date.now();
      await promises.writeFile('/tmp/ups', startedTime.toString(10));
      console.log('start Time');
    }
  }
  return startedTime;
}

async function haltIfneeded() {
  const rc = readConfig();
  const startedServerTime = await readStartedDate();
  const upsMaxTimeHours = rc.upsMaxTimeHours || '8';
  if ((Date.now() - startedServerTime) > (parseInt(upsMaxTimeHours, 10) * 60 * 60 * 1000)) {
    await halt();
  } else {
    const currentValue = await data();
    if (!currentValue) {
      console.error('Current ups does not exists');
    } else if (currentValue.current < 0) {
      await halt();
    }
  }
}

module.exports.haltIfneeded = haltIfneeded;
