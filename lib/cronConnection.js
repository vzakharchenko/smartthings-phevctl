const { CronJob } = require('cron');
const { logger } = require('./logger');
const { syncSmartthingsDevices } = require('./smartthingsConnection');

async function syncDevices() {
  await syncSmartthingsDevices();
}

function installCrons() {
  const cronJob = new CronJob('0 */30 * * * *', (async () => {
    await syncDevices();
  }), null, true, 'America/Los_Angeles');
  logger.debug('System TZ next 5: ', cronJob.nextDates(5));
}
module.exports.installCrons = installCrons;
