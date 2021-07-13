'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {DEFAULT_PORT, API_PREFIX} = require(`../../constants`);
const routerApi = require(`../api`);

const server = express();

server.use(express.json());
server.use(API_PREFIX, routerApi);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = +customPort || DEFAULT_PORT;

    server.listen(port, () => console.info(chalk.green(`Waiting for connection on ${port}`)));
    server.on(`error`, ({message}) => console.error(`Server creation error: ${message}`));
  }
};
