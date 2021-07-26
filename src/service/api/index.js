'use strict';

const {Router} = require(`express`);
const category = require(`./category`);
const search = require(`./search`);
const article = require(`./article`);
const {getMockData} = require(`../lib/get-mock-data`);
const {API_PREFIX} = require(`../../constants`);
const {CategoryService, SearchService, ArticleService, CommentService} = require(`../data-service`);

module.exports = async (app) => {
  const mockData = await getMockData();
  const router = new Router();

  app.use(API_PREFIX, router);

  category(router, new CategoryService(mockData));
  search(router, new SearchService(mockData));
  article(router, new ArticleService(mockData), new CommentService());
};
