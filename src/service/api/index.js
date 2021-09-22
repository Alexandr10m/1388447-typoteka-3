'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const search = require(`./search`);
const article = require(`./article`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../../models`);
const {API_PREFIX} = require(`../../constants`);
const {CategoryService, SearchService, ArticleService, CommentService} = require(`../data-service`);

module.exports = async (app) => {
  const router = new Router();
  defineModels(sequelize);
  app.use(API_PREFIX, router);

  article(router, new ArticleService(sequelize), new CommentService(sequelize));
  search(router, new SearchService(sequelize));
  category(router, new CategoryService(sequelize));
};
