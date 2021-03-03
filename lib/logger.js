const winston = require('winston');

const MESSAGE = Symbol.for('message');
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format((info) => {
      // eslint-disable-next-line no-param-reassign
      info[MESSAGE] = `${new Date().toISOString()} ${info.level}: ${info.message}`;
      return info;
    })(),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports.logger = logger;
