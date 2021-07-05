'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {DEFAULT_PORT} = require(`../../constants`);
const postRouts = require(`./routs`);

const server = express();
server.use(express.json());
server.use(`/posts`, postRouts);

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = +customPort || DEFAULT_PORT;

    server.listen(port, () => console.info(chalk.green(`Waiting for connection on ${port}`)))
    server.on(`error`, ({message}) => console.error(`Server creation error: ${message}`));
  }
};
