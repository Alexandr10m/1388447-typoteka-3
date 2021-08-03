'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getAPI} = require(`../api`);

const api = getAPI();
const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`main`, {articles});
});

mainRoutes.get(`/register`, (req, res) => res.render(`sign-up`));
mainRoutes.get(`/login`, (req, res) => res.render(`login`));

mainRoutes.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;

    if (!search) {
      res.render(`search/search`);
      return;
    }

    const results = await api.search(search);
    res.render(`search/search-result`, {results});

  } catch (error) {
    if (error.response.status === HttpCode.NOT_FOUND) {
      res.render(`search/search-empty`, {
        results: false
      });
      return;
    }

    res.render(`search-result`, {
      results: []
    });
  }
});

mainRoutes.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = mainRoutes;
