const { CronJob } = require('cron');
const { updateSmartthingsDevices } = require('./smartthingsConnection');
const { logger } = require('./logger');
const { syncSmartthingsDevices } = require('./smartthingsConnection');

async function syncDevices() {
  await syncSmartthingsDevices();
}
async function updateDevices() {
  await updateSmartthingsDevices();
}

function installCrons() {
  const cronJob = new CronJob('0 */30 * * * *', (async () => {
    await syncDevices();
  }), null, true);
  logger.debug('System TZ next 5: ', cronJob.nextDates(5));
  const cronJob2 = new CronJob('0 */10 * * * *', (async () => {
    await updateDevices();
  }), null, true);
  logger.debug('System TZ next 5: ', cronJob2.nextDates(5));
}
module.exports.installCrons = installCrons;
