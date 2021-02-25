const { exec } = require('child_process');

const actionToCommands = {
  airconOn: (readConfig) => `phevctl -m "${readConfig.macAddress}" aircon on`,
  airconOff: (readConfig) => `phevctl -m "${readConfig.macAddress}" aircon off`,
  headlightsOn: (readConfig) => `phevctl -m "${readConfig.macAddress}" headlights on`,
  headlightsOff: (readConfig) => `phevctl -m "${readConfig.macAddress}" headlights off`,
  parkinglightsOn: (readConfig) => `phevctl -m "${readConfig.macAddress}" parkinglights on`,
  parkinglightsOff: (readConfig) => `phevctl -m "${readConfig.macAddress}" parkinglights off`,
};

function execute(deviceId, readConfig) {
  return new Promise((resolve) => {
    const device = readConfig.smartthings.devices.find((d) => d.id === deviceId);
    if (device) {
      const child = exec(actionToCommands[device.actionId](readConfig));
      child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });
      child.on('close', (code) => {
        console.log(`closing code: ${code}`);
        resolve(code);
      });
    } else {
      resolve(0);
    }
  });
}

module.exports.executeAction = execute;
