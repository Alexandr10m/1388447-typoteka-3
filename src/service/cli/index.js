'use strict';

const version = require('./version');
const help = require('./help');
const generate = require('./generate');

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
}

module.exports = {
  Cli,
}
