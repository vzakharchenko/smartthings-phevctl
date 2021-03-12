const { smartthingsNotification } = require('./smartthingsConnection');
const { logger } = require('./logger');
const { executeActionDirect } = require('./executeService');
const { smartthingsOffDevice } = require('./smartthingsConnection');
const { forceUpdate } = require('./executeService');
const { smartthingsUpdateDevice } = require('./smartthingsConnection');
const { syncSmartthingsDevices } = require('./smartthingsConnection');
const { smartthingsDeleteDevice } = require('./smartthingsConnection');
const { smartthingsAddDevice } = require('./smartthingsConnection');
const { saveConfig, readConfig } = require('./env.js');

async function getSettings(req, res) {
  const { smartthings } = readConfig();
  if (!smartthings) {
    res.end(JSON.stringify({ status: 'FAIL', message: ' Wrong Configuration File' }));
  } else {
    const c = JSON.parse(JSON.stringify(readConfig()));
    delete c.file;
    res.end(JSON.stringify({ status: 'OK', data: c }));
  }
}

function saveSetting(req, res) {
  const reqConfig = req.body;
  const { smartthings } = reqConfig;
  const { users } = reqConfig;
  delete reqConfig.users;
  delete reqConfig.smartthings;
  const readConfigOrigin = readConfig();
  const smartthingsCur = readConfigOrigin.smartthings;
  const curConfig = { ...readConfigOrigin, ...reqConfig };
  if (smartthings) {
    const newSmartthingsDevices = smartthings.devices || [];
    (smartthingsCur.devices || []).forEach((v) => {
      const existingDevice = (smartthings.devices || []).find((u) => u.id === v.id);
      if (!existingDevice) {
        newSmartthingsDevices.push(v);
      }
    });
    curConfig.smartthings = { ...curConfig.smartthings, ...smartthings };
    curConfig.smartthings.sms = { ...curConfig.smartthings.sms, ...smartthings.sms };
    curConfig.smartthings.devices = newSmartthingsDevices;
  }
  if (users) {
    const newUserList = users;
    readConfigOrigin.users.forEach((v) => {
      const existingUser = users.find((u) => u.id === v.id);
      if (!existingUser) {
        newUserList.push(v);
      }
    });
    curConfig.users = newUserList;
  }
  saveConfig(curConfig);
  res.end(JSON.stringify({ status: 'OK' }));
}

function deleteUser(req, res) {
  const { userId } = req.body;
  const curConfig = readConfig();
  if (curConfig.users.length > 1) {
    curConfig.users = curConfig.users.filter((u) => u.id !== userId);
    saveConfig(curConfig);
    res.end(JSON.stringify({ status: 'OK' }));
  } else {
    res.end(JSON.stringify({ status: 'Fail', message: 'You can not delete the last user' }));
  }
}

async function deleteDevice(req, res) {
  const { deviceId } = req.body;
  const curConfig = readConfig();
  curConfig.smartthings.devices = curConfig.smartthings.devices.filter((d) => d.id !== deviceId);
  await smartthingsDeleteDevice(deviceId);
  saveConfig(curConfig);
  res.end(JSON.stringify({ status: 'OK' }));
}

async function addDevice(req, res) {
  const device = req.body;
  device.updatable = ['battery', 'doors', 'hvac'].includes(device.actionId);
  device.multi2 = ['battery'].includes(device.actionId);
  const curConfig = readConfig();
  if (!curConfig.smartthings.devices) {
    curConfig.smartthings.devices = [];
  }
  const existingDevice = (curConfig.smartthings.devices).find((d) => d.id === device.id);
  if (existingDevice) {
    curConfig.smartthings.devices = curConfig.smartthings.devices.filter((d) => d.id !== device.id);
  }
  curConfig.smartthings.devices.push(device);
  await smartthingsAddDevice(device);
  saveConfig(curConfig);
  res.end(JSON.stringify({ status: 'OK' }));
}

async function testNotification(req, res) {
  const mes = req.body;
  const { message } = mes;
  await smartthingsNotification(message);
  res.end(JSON.stringify({ status: 'OK' }));
}
async function testDevice(req, res) {
  const device = req.body;
  const { id } = device;
  const rc = readConfig();
  const dev = rc.smartthings.devices.find((d) => d.id === id);
  if (dev.updatable) {
    if (rc.smartthings.executeUpdate) {
      await forceUpdate(rc);
    }
    await smartthingsUpdateDevice(dev);
  } else {
    logger.info(`execute device ${dev.deviceLabel}`);
    await executeActionDirect(dev, readConfig());

    if (dev.hvacUpdatable) {
      setTimeout(async () => {
        if (rc.smartthings.executeUpdate) {
          logger.info(`force Update for ${device.deviceLabel}`);
          await forceUpdate(rc);
        }
        logger.info(`execute hvac ${dev.deviceLabel}`);
        const hvacDevices = rc.smartthings.devices.filter((d) => d.actionId === 'hvac');
        const hvacDevicesPromises = [];
        hvacDevices.forEach((hvac) => {
          hvacDevicesPromises.push(smartthingsUpdateDevice(hvac));
        });
        await Promise.all(hvacDevicesPromises);
      }, 3000);
    }
    await smartthingsOffDevice(id);
  }
  res.end(JSON.stringify({ status: 'OK' }));
}

async function syncDevice(req, res) {
  await syncSmartthingsDevices();
  res.end(JSON.stringify({ status: 'OK' }));
}

module.exports.getSettings = getSettings;
module.exports.saveSetting = saveSetting;
module.exports.deleteUser = deleteUser;
module.exports.deleteDevice = deleteDevice;
module.exports.testDevice = testDevice;
module.exports.testNotification = testNotification;
module.exports.addDevice = addDevice;
module.exports.syncDevice = syncDevice;
