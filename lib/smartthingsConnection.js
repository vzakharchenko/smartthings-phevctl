const { addSMSNotification2 } = require('./SMSBackend');
const { getAllCloudDevicesFromSmartThings } = require('./smartthings');
const { addSMSNotification1 } = require('./SMSBackend');
const { getLabels } = require('./Localization');
const { getNotificationByActionId } = require('./executeService');
const { sendNotification } = require('./smartthings');
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
      const status = await getSmartAppInfo(smartapp[i], appId, secret);
      logger.info(`shard ${smartapp[i]} selected`);
      logger.info(`useCloud: ${status.useCloud}`);
      return { shard: smartapp[i], useCloud: status.useCloud };
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
async function smartthingsAllCloudDevice() {
  const { smartthings } = readConfig();
  const status = await getAllCloudDevicesFromSmartThings(smartthings.shard,
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
  const allDevices = await smartthingsAllDevice();
  if (!allDevices) {
    return;
  }
  const { devices } = allDevices;
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

function theftIdToMessage(theftId, language) {
  if (!theftId) {
    return null;
  }
  switch (theftId) {
    case 0: {
      return null;
    }
    case 1: {
      return language.err1intrusion;
    }
    case 2: {
      return language.err1movement;
    }
    case 3: {
      return language.err1perimeter;
    }
    case 4: {
      return language.err1ignition;
    }
    case 5: {
      return language.err1silent;
    }
    default: {
      return language.err1other;
    }
  }
}
function theftIdToMessageCode(theftId) {
  if (!theftId) {
    return null;
  }
  switch (theftId) {
    case 0: {
      return null;
    }
    case 1: {
      return 'err1intrusion';
    }
    case 2: {
      return 'err1movement';
    }
    case 3: {
      return 'err1perimeter';
    }
    case 4: {
      return 'err1ignition';
    }
    case 5: {
      return 'err1silent';
    }
    default: {
      return 'err1other';
    }
  }
}

async function updateSmartthingsDevices() {
  const curConfig = readConfig();
  if (curConfig.smartthings.devices == null) {
    curConfig.smartthings.devices = [];
  }
  if (curConfig.smartthings.sendNotification
      || curConfig.smartthings.sms.sendSMSNotification) {
    const messages = [];
    if (curConfig.theft) {
      const theftmessageId = await getNotificationByActionId('theftStatus', curConfig);
      const theftLocalizatedMessageId = theftIdToMessage(theftmessageId, getLabels());
      if (theftLocalizatedMessageId) {
        messages.push({
          code: theftIdToMessageCode(theftLocalizatedMessageId),
          text: theftLocalizatedMessageId,
        });
      }
    }
    if (curConfig.notifications.batteryHeater !== 'none') {
      const message = await getNotificationByActionId('batteryWarning', curConfig);
      const localizatedMessage = batteryWarningMessage(message, getLabels());
      if (localizatedMessage) {
        messages.push({
          code: batteryWarningMessageCode(message),
          text: localizatedMessage,
        });
      }
    }
    const messageErrInfo = await getNotificationByActionId('errACinfo', curConfig);
    if (messageErrInfo) {
      messages.push({
        code: 'errACinfo',
        text: getLabels().errACinfo,
      });
    }
    if (curConfig.notifications.preaccont !== 'none') {
      const preaccontInfo = await getNotificationByActionId('preaccont', curConfig);
      if (preaccontInfo) {
        messages.push({
          code: 'preACContInfo',
          text: getLabels().preACContInfo,
        });
      }
    }

    // const messageErrInfo1 = await getNotificationByActionId('errTimerinfo', curConfig);
    // if (messageErrInfo1) {
    //   messages.push({
    //     code: 'errTimerinfo',
    //     text: getLabels().errTimerinfo,
    //   });
    // }
    // const messageErrInfo2 = await getNotificationByActionId('errCHGinfo', curConfig);
    // if (messageErrInfo2) {
    //   messages.push({
    //     code: 'errCHGinfo',
    //     text: getLabels().errCHGinfo,
    //   });
    // }
    if (curConfig.notifications.batteryHeater !== 'none') {
      const batteryWarmInfo = await getNotificationByActionId('battery', curConfig);
      if (batteryWarmInfo) {
        messages.push({
          code: 'batteryHeater',
          text: getLabels().batteryHeater,
        });
      }
    }

    if (messages.length > 0) {
      logger.info(`Notifications to Send: ${JSON.stringify(messages)}`);
      const smsText = messages.filter((m) => {
        const notification = curConfig.notifications[m.code];
        const smsSent = notification === 'both' || notification === 'sms';
        if (!smsSent) {
          logger.info(`skip sms notification for ${m.code}`);
        }
        return smsSent;
      }).map((m) => m.code).join(',');
      logger.info(`SMS Notification: ${smsText}`);
      if (smsText) {
        addSMSNotification1(`phev code's: ${smsText}`, curConfig);
      }
      const promises = [];
      messages.forEach((m) => {
        const notification = curConfig.notifications[m.code];
        if (notification === 'both'
            || notification === 'push') {
          promises.push(smartthingsNotification(m.text));
        } else {
          logger.info(`skip push notification for ${m.code}`);
        }
      });
      try {
        await Promise.all(promises);
      } catch (e) {
        logger.warn(e);
      }
    }
  }
  const devices = curConfig.smartthings.devices.filter((device) => device.updatable);
  if (devices.length > 0) {
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

function executeActionRes(rc, device) {
  if (device && device.actionId === 'forceUpdate') {
    updateSmartthingsDevices().then(() => {
      logger.info(`${device.deviceLabel} successfully executed`);
      smartthingsOffDevice(device.id).then();
    }).catch(() => {
      logger.error(`${device.deviceLabel} failed to execute`);
      smartthingsOffDevice(device.id).then();
    });
  } else {
    const promise = executeAction(device.id, rc);
    if (promise) {
      promise.then(async () => {
        const notification = rc.notifications.confirm;
        if (notification === 'both' || notification === 'sms') {
          addSMSNotification2(`${device.actionId} successfully executed`, rc);
        }
        if (notification === 'both' || notification === 'push') {
          await smartthingsNotification(`${device.actionId} successfully executed`);
        }
        if (device && device.hvacUpdatable) {
          setTimeout(async () => {
            logger.info(`execute hvac for ${device.deviceLabel}`);
            const hvacDevices = rc.smartthings.devices.filter((d) => d.actionId === 'hvac');
            const hvacDevicesPromises = [];
            hvacDevices.forEach((hvac) => {
              if (device && device.hvacUpdatable) {
                hvacDevicesPromises.push(smartthingsUpdateDevice(hvac));
              }
            });
            await Promise.all(hvacDevicesPromises);
          }, 15000);
        }
        logger.info(`${device.deviceLabel} successfully executed`);
      }).catch(() => {
        logger.error(`${device.deviceLabel} failed to execute`);
      });
    }
  }
}
async function cloudSmartthingsDevices() {
  const curConfig = readConfig();
  if (!curConfig.smartthings.useSmartthings) {
    return;
  }
  if (curConfig.smartthings.useCloud) {
    return;
  }
  const allDevices = await smartthingsAllCloudDevice();
  if (!allDevices) {
    return;
  }
  const { devices } = allDevices;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < devices.length; i++) {
    const existingDevice = curConfig.smartthings.devices.find((d) => d.id === devices[i].id);
    if (existingDevice) {
      if (devices[i].status && devices[i].status.value === 'on') {
        executeActionRes(curConfig, existingDevice);
      }
    }
  }
  curConfig.smartthings.devices = curConfig
    .smartthings.devices.filter((d) => devices.find((sd) => sd.id === d.id));
  saveConfig(curConfig);
}

module.exports.smartthingsCheck = smartthingsCheck;
module.exports.smartthingsAddDevice = smartthingsAddDevice;
module.exports.smartthingsDeleteDevice = smartthingsDeleteDevice;
module.exports.smartthingsAllDevice = smartthingsAllDevice;
module.exports.smartthingsOffDevice = smartthingsOffDevice;
module.exports.syncSmartthingsDevices = syncSmartthingsDevices;
module.exports.cloudSmartthingsDevices = cloudSmartthingsDevices;
module.exports.updateSmartthingsDevices = updateSmartthingsDevices;
module.exports.smartthingsUpdateDevice = smartthingsUpdateDevice;
module.exports.smartthingsNotification = smartthingsNotification;
module.exports.executeActionRes = executeActionRes;
