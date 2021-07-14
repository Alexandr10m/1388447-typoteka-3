'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const router = new Router();
  app.use(`/categories`, router);

  router.get(`/`, (req, res) => {
    const categories = service.findAll();
    res.status(HttpCode.OK)
      .json(categories);
  });
};
