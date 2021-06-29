"use strict";

const { Router } = require(`express`);

const articleRoutes = new Router();

articleRoutes.get(`/`, (req, res) => res.send(`/articles`));
articleRoutes.get(`/category/:id`, (req, res) =>
  res.send(`/articles/category/:id`)
);
articleRoutes.get(`/add`, (req, res) => res.send(`/articles/add`));
articleRoutes.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
articleRoutes.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = articleRoutes;
