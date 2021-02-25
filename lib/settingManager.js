// const { exec } = require('child_process');
const { smartthingsAllDevice } = require('./smartthingsConnection');
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

async function syncDevice(req, res) {
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
      curConfig.smartthings.devices.push(existingDevice);
    } else {
      // eslint-disable-next-line no-await-in-loop
      await smartthingsDeleteDevice(devices[i].id);
    }
  }
  curConfig.smartthings.devices = curConfig
    .smartthings.devices.filter((d) => devices.find((sd) => sd.id === d.id));
  saveConfig(curConfig);
  res.end(JSON.stringify({ status: 'OK' }));
}

module.exports.getSettings = getSettings;
module.exports.saveSetting = saveSetting;
module.exports.deleteUser = deleteUser;
module.exports.deleteDevice = deleteDevice;
module.exports.addDevice = addDevice;
module.exports.syncDevice = syncDevice;
