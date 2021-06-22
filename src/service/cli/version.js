'use strict';

const {version} = require(`../../../package.json`);
const chalk = require('chalk');

module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(version));
  }
}
