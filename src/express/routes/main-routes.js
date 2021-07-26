'use strict';

const {Router} = require(`express`);
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
    const results = await api.search(search);

    res.render(`search-result`, {results});
  } catch (error) {
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
