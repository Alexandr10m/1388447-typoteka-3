"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {upload} = require(`../multer-config`);

const api = getAPI();
const articleRoutes = new Router();

articleRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

articleRoutes.get(`/category/:id`, (req, res) =>
  res.render(`articles-by-category`)
);

articleRoutes.get(`/add`, async (req, res) => {
  res.render(`new-post`);
});

articleRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id), api.getCategories()]);
  res.render(`post`, {article, categories});
});

articleRoutes.get(`/:id`, async (req, res) => {
  const articleId = req.params;
  const article = await api.getArticle(articleId);
  res.render(`post`, {article});
});

articleRoutes.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const newArticle = {
    photo: file.filename,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: [],
    createdDate: body.date,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
});

module.exports = articleRoutes;
