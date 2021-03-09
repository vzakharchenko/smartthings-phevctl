const { forceUpdate } = require('./executeService');
const { executeAction2 } = require('./executeService');
const { executeAction } = require('./executeService');
const { updateSmartThingsDevice } = require('./smartthings');
const { logger } = require('./logger');
const { saveConfig } = require('./env');
const { offDeviceFromSmartThings } = require('./smartthings');
const { getAllDevicesFromSmartThings } = require('./smartthings');
const { deleteDeviceFromSmartThings } = require('./smartthings');
const {
  getSmartAppInfo,
  addDeviceToSmartThings,
} = require('./smartthings.js');
const { readConfig } = require('./env.js');

const mapping = {
  battery: 'charging',
};

async function smartthingsCheck(appId, secret) {
  const { smartapp } = readConfig();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < smartapp.length; i++) {
    try {
      await getSmartAppInfo(smartapp[i], appId, secret);
      logger.info(`shard ${smartapp[i]} selected`);
      return smartapp[i];
    } catch (e) {
      logger.warn(`shard ${smartapp[i]} does not match`);
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

async function smartthingsUpdateDevice(device) {
  const rc = readConfig();
  if (device.updatable) {
    let value;
    let value2;
    if (device.multi2) {
      const values = await executeAction2(device.id, mapping[device.actionId], rc);
      if (values) {
        value = values.value;
        value2 = values.value2;
      }
    } else {
      value = await executeAction(device.id, rc);
    }
    if (value) {
      await updateSmartThingsDevice(rc.smartthings.shard,
        rc.smartthings.appId,
        rc.smartthings.appSecret, device.id, value, value2);
    }
  }
}

async function syncSmartthingsDevices() {
  const curConfig = readConfig();
  if (curConfig.smartthings.devices == null) {
    curConfig.smartthings.devices = [];
  }
  const { devices } = await smartthingsAllDevice();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < devices.length; i++) {
    const existingDevice = curConfig.smartthings.devices.find((d) => d.id === devices[i].id);
    if (existingDevice) {
      curConfig.smartthings.devices = curConfig
        .smartthings.devices.filter((d) => d.id !== devices[i].id);
      existingDevice.deviceLabel = devices[i].label;
      await smartthingsOffDevice(devices[i].id);
      curConfig.smartthings.devices.push(existingDevice);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await smartthingsDeleteDevice(devices[i].id);
    }
  }
  curConfig.smartthings.devices = curConfig
    .smartthings.devices.filter((d) => devices.find((sd) => sd.id === d.id));
  saveConfig(curConfig);
}

async function updateSmartthingsDevices() {
  const curConfig = readConfig();
  if (curConfig.smartthings.devices == null) {
    curConfig.smartthings.devices = [];
  }
  const devices = curConfig.smartthings.devices.filter((device) => device.updatable);
  if (devices.length > 0) {
    if (curConfig.smartthings.executeUpdate) {
      await forceUpdate(curConfig);
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < devices.length; i++) {
      const existingDevice = devices[i];
      try {
        await smartthingsUpdateDevice(existingDevice);
      } catch (e) {
        logger.error(e);
      }
    }
  }
}

module.exports.smartthingsCheck = smartthingsCheck;
module.exports.smartthingsAddDevice = smartthingsAddDevice;
module.exports.smartthingsDeleteDevice = smartthingsDeleteDevice;
module.exports.smartthingsAllDevice = smartthingsAllDevice;
module.exports.smartthingsOffDevice = smartthingsOffDevice;
module.exports.syncSmartthingsDevices = syncSmartthingsDevices;
module.exports.updateSmartthingsDevices = updateSmartthingsDevices;
module.exports.smartthingsUpdateDevice = smartthingsUpdateDevice;
