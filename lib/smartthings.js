const { logger } = require('./logger');
const { fetchData, sendData } = require('./restCalls.js');

const apiGateWay = (shard) => `${shard}/api/smartapps/installations/`;
const apiSmartAppCheck = () => '/smartapp/check?access_token=';
const apiSmartAppAllDevices = () => '/smartapp/allDevices?access_token=';
const apiSmartAppStatusDevices = () => '/smartapp/statusDevices?access_token=';
const apiSmartAppAddDevice = () => '/smartapp/addDevice?access_token=';
const apiSmartAppDeleteDevice = () => '/smartapp/deleteDevice?access_token=';
const apiSmartAppOffDevice = () => '/smartapp/offDevice?access_token=';
const apiSmartAppUpdateDevice = () => '/smartapp/updateDevice?access_token=';
const apiSmartAppNotification = () => '/smartapp/notification?access_token=';

async function getSmartAppInfo(shard, appId, secret) {
  const url = `${apiGateWay(shard)}${appId}${apiSmartAppCheck()}${secret}`;
  const res = await fetchData(
    url,
  );
  return JSON.parse(res.data);
}

async function getAllDevicesFromSmartThings(shard, appId, secret) {
  try {
    const url = `${apiGateWay(shard)}${appId}${apiSmartAppAllDevices()}${secret}`;
    const res = await fetchData(
      url,
    );
    return JSON.parse(res.data);
  } catch (e) {
    logger.warn(e.message);
    return null;
  }
}

async function getAllCloudDevicesFromSmartThings(shard, appId, secret) {
  try {
    const url = `${apiGateWay(shard)}${appId}${apiSmartAppStatusDevices()}${secret}`;
    const res = await fetchData(
      url,
    );
    return JSON.parse(res.data);
  } catch (e) {
    logger.warn(e.message);
    return null;
  }
}

async function addDeviceToSmartThings(shard, appId, secret, device) {
  const url = `${apiGateWay(shard)}${appId}${apiSmartAppAddDevice()}${secret}`;
  const res = await sendData(url, 'POST', JSON.stringify(device), {
    'Content-Type': 'application/json',
  });
  return JSON.parse(res.data);
}

async function deleteDeviceFromSmartThings(shard, appId, secret, deviceId) {
  const url = `${apiGateWay(shard)}${appId}${apiSmartAppDeleteDevice()}${secret}`;
  const res = await sendData(url, 'POST', JSON.stringify({ id: deviceId }), {
    'Content-Type': 'application/json',
  });
  return JSON.parse(res.data);
}
async function offDeviceFromSmartThings(shard, appId, secret, deviceId) {
  const url = `${apiGateWay(shard)}${appId}${apiSmartAppOffDevice()}${secret}`;
  try {
    const res = await sendData(url, 'POST', JSON.stringify({ id: deviceId }), {
      'Content-Type': 'application/json',
    });
    return JSON.parse(res.data);
  } catch (e) {
    logger.warn(e.message);
    return null;
  }
}

async function sendNotification(shard, appId, secret, message) {
  try {
    const url = `${apiGateWay(shard)}${appId}${apiSmartAppNotification()}${secret}`;
    const res = await sendData(url, 'POST', JSON.stringify({ message }), {
      'Content-Type': 'application/json',
    });
    return JSON.parse(res.data);
  } catch (e) {
    logger.warn(e.message);
    return null;
  }
}

async function updateSmartThingsDevice(shard, appId, secret, deviceId, value, value2) {
  try {
    const url = `${apiGateWay(shard)}${appId}${apiSmartAppUpdateDevice()}${secret}`;
    const res = await sendData(url, 'POST', JSON.stringify({ id: deviceId, value, value2 }), {
      'Content-Type': 'application/json',
    });
    return JSON.parse(res.data);
  } catch (e) {
    logger.warn(e.message);
    return null;
  }
}

module.exports.getSmartAppInfo = getSmartAppInfo;
module.exports.addDeviceToSmartThings = addDeviceToSmartThings;
module.exports.deleteDeviceFromSmartThings = deleteDeviceFromSmartThings;
module.exports.getAllDevicesFromSmartThings = getAllDevicesFromSmartThings;
module.exports.getAllCloudDevicesFromSmartThings = getAllCloudDevicesFromSmartThings;
module.exports.offDeviceFromSmartThings = offDeviceFromSmartThings;
module.exports.updateSmartThingsDevice = updateSmartThingsDevice;
module.exports.sendNotification = sendNotification;
