const { Gpio } = require('pigpio');
const { halt } = require('./shutdownService');

let shutdown = null;

function initGPIO(config) {
  if (config.gpio.enabled) {
    shutdown = new Gpio(parseInt(config.gpio.shutdown.gpio, 10), {
      mode: Gpio.INPUT,
      pullUpDown: parseInt(config.gpio.shutdown.pullUpDown, 10),
      edge: parseInt(config.gpio.shutdown.edge, 10),
    });
    shutdown.on('interrupt', async (level) => {
      if (level === config.gpio.shutdown.level) {
        console.info('Starting shutdown');
        await halt();
      }
    });
  }
}

module.exports.initGPIO = initGPIO;
