'use strict';

const winston = require('winston');

const logger = new (winston.Logger)({
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
  
  transports: [
    new (winston.transports.File)({
      filename: 'log.json',
      level: 'silly',  // logs ALL
    }),
    new (winston.transports.Console)({
      level: 'info', // logs 'error' | 'warn' | 'info'
    }),
  ],
});

let log = (method, text) => {
  logger.log(method, text);
};

module.exports = log;