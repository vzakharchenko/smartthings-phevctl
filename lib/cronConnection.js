const { CronJob } = require('cron');
const { cloudSmartthingsDevices } = require('./smartthingsConnection');
const { readConfig } = require('./env');
const { updateSmartthingsDevices } = require('./smartthingsConnection');
const { logger } = require('./logger');
const { syncSmartthingsDevices } = require('./smartthingsConnection');

async function syncDevices() {
  await syncSmartthingsDevices();
}
async function updateDevices() {
  await updateSmartthingsDevices();
}
async function cloudDevices() {
  await cloudSmartthingsDevices();
}

function installCrons() {
  const rc = readConfig();
  const cronJob = new CronJob(rc.cron.syncDevices, (async () => {
    await syncDevices();
  }), null, true);
  logger.debug('System TZ next 5: ', cronJob.nextDates(5));
  const cronJob2 = new CronJob(rc.cron.updateDevices, (async () => {
    await updateDevices();
  }), null, true);
  logger.debug('System TZ next 5: ', cronJob2.nextDates(5));
  const cronJob3 = new CronJob(rc.cron.cloudDevices, (async () => {
    await cloudDevices();
  }), null, true);
  logger.debug('System TZ next 5: ', cronJob3.nextDates(5));
}
module.exports.installCrons = installCrons;
