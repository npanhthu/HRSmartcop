'use strict';

require('6to5/register');

process.env.NODE_ENV = 'development';

var server = require('../../../../server.js');

var request = require('superagent');
var prefix = require('superagent-prefix')('http://localhost:3007');

var World = function World(callback) {
  this.request = request;
  this.prefix = prefix;
  callback();
};

module.exports.World = World;
