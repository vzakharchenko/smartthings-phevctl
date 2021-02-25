const { offDeviceFromSmartThings } = require('./smartthings');
const { getAllDevicesFromSmartThings } = require('./smartthings');
const { deleteDeviceFromSmartThings } = require('./smartthings');
const {
  getSmartAppInfo,
  addDeviceToSmartThings,
} = require('./smartthings.js');
const { readConfig } = require('./env.js');

async function smartthingsCheck(appId, secret) {
  const { smartapp } = readConfig();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < smartapp.length; i++) {
    try {
      await getSmartAppInfo(smartapp[i], appId, secret);
      console.info(`shard ${smartapp[i]} selected`);
      return smartapp[i];
    } catch (e) {
      console.warn(`shard ${smartapp[i]} does not match`);
    }
  }
  return null;
}

async function smartthingsAddDevice(device) {
  const { smartthings } = readConfig();
  const status = await addDeviceToSmartThings(smartthings.shard,
    smartthings.appId,
    smartthings.appSecret, device);
  return status;
}

async function smartthingsAllDevice() {
  const { smartthings } = readConfig();
  const status = await getAllDevicesFromSmartThings(smartthings.shard,
    smartthings.appId,
    smartthings.appSecret);
  return status;
}

async function smartthingsDeleteDevice(deviceId) {
  const { smartthings } = readConfig();
  const status = await deleteDeviceFromSmartThings(smartthings.shard,
    smartthings.appId,
    smartthings.appSecret, deviceId);
  return status;
}
async function smartthingsOffDevice(deviceId) {
  const { smartthings } = readConfig();
  const status = await offDeviceFromSmartThings(smartthings.shard,
    smartthings.appId,
    smartthings.appSecret, deviceId);
  return status;
}

module.exports.smartthingsCheck = smartthingsCheck;
module.exports.smartthingsAddDevice = smartthingsAddDevice;
module.exports.smartthingsDeleteDevice = smartthingsDeleteDevice;
module.exports.smartthingsAllDevice = smartthingsAllDevice;
module.exports.smartthingsOffDevice = smartthingsOffDevice;
