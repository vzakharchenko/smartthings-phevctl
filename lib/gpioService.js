const { Gpio } = require('onoff');
const { halt } = require('./shutdownService');

let shutdown = null;

function initGPIO(config) {
  if (config.gpio.enabled) {
    const edgeInt = parseInt(config.gpio.shutdown.edge, 10);
    let edge = 'none';
    if (edgeInt === 0) {
      edge = 'rising';
    } else if (edgeInt === 1) {
      edge = 'falling';
    } else if (edgeInt === 2) {
      edge = 'both';
    }

    shutdown = new Gpio(parseInt(config.gpio.shutdown.gpio, 10), 'in', edge);
    shutdown.read().then(async (value) => {
      if (value === parseInt(config.gpio.shutdown.level, 10)) {
        console.info('Shutdown server');
        await halt();
      }
    });

    shutdown.watch(async (err, value) => {
      if (err) {
        throw err;
      }
      if (parseInt(config.gpio.shutdown.level, 10) === value) {
        console.info('Shutdown server');
        await halt();
      }
    });

    process.on('SIGINT', () => {
      shutdown.unexport();
    });
  }
}

module.exports.initGPIO = initGPIO;
