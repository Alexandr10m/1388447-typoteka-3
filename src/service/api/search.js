'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getLogger} = require(`../lib/logger`);

module.exports = (app, service) => {
  const router = new Router();
  const logger = getLogger({name: `api/search`});

  app.use(`/search`, router);

  router.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST)
        .send(`Bad request`);
      return;
    }
    try {
      const result = await service.findAll(query);

      if (!result.length) {
        res.status(HttpCode.NOT_FOUND)
          .send(`Query ${query} not found.`);
        return;
      }

      res.status(HttpCode.OK)
        .json(result);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }

  });
};
