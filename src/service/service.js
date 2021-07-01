'use strict';

const {ExitCode, USER_ARGV_INDEX, DEFAULT_COMMAND} = require(`../constants.js`);
const {Cli} = require(`./cli`);
const chalk = require(`chalk`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand] = userArguments;

(async () => {
  try {
    if (userArguments.length === 0 || !Cli[userCommand]) {
      await Cli[DEFAULT_COMMAND].run();
      return;
    }

    await Cli[userCommand].run(userArguments.slice(1));
  } catch (err) {
    console.error(chalk.red(`Что-то пошло не так ...`), err);
    process.exit(ExitCode.ERROR);
  }
})();


