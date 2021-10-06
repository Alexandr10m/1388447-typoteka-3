'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const {getAPI} = require(`../api`);

const ARTICLES_PER_PAGE = 8;

const api = getAPI();
const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, rows: articles}, categories] = await Promise.all([
    api.getArticles({limit, offset, comments: false}),
    api.getCategories(true)
  ]);
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  console.log(articles);

  res.render(`main`, {articles, page, totalPages, categories});
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
