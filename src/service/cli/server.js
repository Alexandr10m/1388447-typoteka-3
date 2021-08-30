'use strict';

const express = require(`express`);
const {DEFAULT_PORT} = require(`../../constants`);
const routerApi = require(`../api`);
const {logger} = require(`../lib/logger`);
const {HttpCode} = require(`../../constants`);
const sequelize = require(`../lib/sequelize`);

const handlerRouteLog = (req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
};

const handlerPageNotFound = (req, res) => {
  res.status(HttpCode.NOT_FOUND);
  logger.error(`Route not found: ${req.url}`);
};

const handlerError = (err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
};

module.exports = {
  name: `--server`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const [customPort] = args;
    const port = +customPort || DEFAULT_PORT;
    const server = express();

    try {
      server.use(express.json());
      server.use(handlerRouteLog);
      await routerApi(server);
      server.use(handlerError);
      server.use(handlerPageNotFound);

      server.listen(port, () => logger.info(`Listening to connections on ${port}`));
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
    }
  }
};
