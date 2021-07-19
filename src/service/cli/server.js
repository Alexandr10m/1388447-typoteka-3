'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {DEFAULT_PORT} = require(`../../constants`);
const routerApi = require(`../api`);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = +customPort || DEFAULT_PORT;
    const server = express();
    server.use(express.json());

    try {
      await routerApi(server);
      server.listen(port, () => console.info(chalk.green(`Waiting for connection on ${port}`)));
    } catch (err) {
      server.on(`error`, ({message}) => console.error(`Server creation error: ${message}`));
    }
  }
};
