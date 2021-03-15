const { EnglishLabels } = require('./Localization');
const { addSMSNotification2 } = require('./SMSBackend');
const { addSMSNotification1 } = require('./SMSBackend');
const { getLabels } = require('./Localization');
const { getNotificationByActionId } = require('./executeService');
const { sendNotification } = require('./smartthings');
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
  if (smartthings.useSmartthings) {
    const status = await offDeviceFromSmartThings(smartthings.shard,
      smartthings.appId,
      smartthings.appSecret, deviceId);
    return status;
  }
  return null;
}

async function smartthingsNotification(message) {
  const { smartthings } = readConfig();
  if (smartthings.useSmartthings) {
    const status = await sendNotification(smartthings.shard,
      smartthings.appId,
      smartthings.appSecret, message);
    return status;
  }
  return null;
}

async function smartthingsUpdateDevice(device) {
  const rc = readConfig();
  if (device.updatable && rc.smartthings.useSmartthings) {
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
      let v = value;
      let v2 = value2;
      if (device.actionId === 'hvac') {
        v = value.value;
        v2 = value.value2;
      }
      await updateSmartThingsDevice(rc.smartthings.shard,
        rc.smartthings.appId,
        rc.smartthings.appSecret, device.id, v, v2);
    }
  }
}

async function syncSmartthingsDevices() {
  const curConfig = readConfig();
  if (!curConfig.smartthings.useSmartthings) {
    return;
  }
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

function batteryWarningMessageCode(messageId) {
  if (!messageId) {
    return null;
  }
  switch (messageId) {
    case 0: {
      return null;
    }
    case 1: {
      return 'topbattwarminginfo_plugin_1';
    }
    case 2: {
      return 'topbattwarminginfo_plugin_2';
    }
    case 3: {
      return 'topbattwarminginfo_warm_1';
    }
    case 4: {
      return 'topbattwarminginfo_warm_2';
    }
    case 5: {
      return 'topbattwarminginfo_stop_1';
    }
    case 6: {
      return 'topbattwarminginfo_stop_2';
    }
    default: {
      return 'topbattwarminginfo';
    }
  }
}
function batteryWarningMessage(messageId, language) {
  if (!messageId) {
    return null;
  }
  switch (messageId) {
    case 0: {
      return null;
    }
    case 1: {
      return language.topbattwarminginfo_plugin_1;
    }
    case 2: {
      return language.topbattwarminginfo_plugin_2;
    }
    case 3: {
      return language.topbattwarminginfo_warm_1;
    }
    case 4: {
      return language.topbattwarminginfo_warm_2;
    }
    case 5: {
      return language.topbattwarminginfo_stop_1;
    }
    case 6: {
      return language.topbattwarminginfo_stop_2;
    }
    default: {
      return language.topbattwarminginfo;
    }
  }
}

async function updateSmartthingsDevices() {
  const curConfig = readConfig();
  if (curConfig.smartthings.devices == null) {
    curConfig.smartthings.devices = [];
  }
  const devices = curConfig.smartthings.devices.filter((device) => device.updatable);
  if (curConfig.smartthings.sendNotification
      || curConfig.smartthings.sms.sendSMSNotification) {
    const message = await getNotificationByActionId('batteryWarning', curConfig);
    const localizatedMessage = batteryWarningMessage(message, getLabels());
    if (localizatedMessage) {
      await smartthingsNotification(localizatedMessage);
      addSMSNotification1(batteryWarningMessageCode(message), curConfig);
    }
    const messageErrInfo = await getNotificationByActionId('errACinfo', curConfig);
    if (messageErrInfo) {
      await smartthingsNotification(getLabels().errACinfo);
      addSMSNotification2('errACinfo');
    }
  }
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
module.exports.smartthingsNotification = smartthingsNotification;
