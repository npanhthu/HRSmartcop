var winston = require('winston');

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            level: 'error'
        }),
        new(winston.transports.File)({
            name: 'debug-file',
            filename: 'debug.log',
            json: false,
            level: 'debug'
        }),
        new(winston.transports.File)({
            name: 'error-file',
            filename: 'error.log',
            json: false,
            level: 'error'
        })
      ]
});

module.exports = logger;
