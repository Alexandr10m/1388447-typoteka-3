'use strict';

const {ExitCode, USER_ARGV_INDEX, DEFAULT_COMMAND} = require('../constants.js');
const {Cli} = require('./cli');

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

try {
  if (userArguments.length === 0 || !Cli[userCommand]) {
    Cli[DEFAULT_COMMAND].run();
    process.exit(ExitCode.SUCCESS);
  }

  Cli[userCommand].run(userArguments.slice(1));
} catch (err) {
  console.error(`Что-то пошло не так.`, err);
  process.exit(ExitCode.ERROR);
}
