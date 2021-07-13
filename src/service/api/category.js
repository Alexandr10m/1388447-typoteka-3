'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`)

const router = new Router();

module.exports = (app, service) => {
  app.use(`/categories`, router);

  router.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK)
        .json(categories);
  });
};
