"use strict";

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {upload} = require(`../multer-config`);

const api = getAPI();
const articleRoutes = new Router();

articleRoutes.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: false}),
    api.getCategories(true)
  ]);
  res.render(`main`, {articles, categories});
});

articleRoutes.get(`/categories/:id`, async (req, res) => {
  const {id} = req.params;
  const articlesByCategory = await api.getCategory(id);

  res.render(`articles-by-category`, {articlesByCategory});
});

articleRoutes.get(`/add`, (req, res) => {
  res.render(`new-post`);
});

articleRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([api.getArticle(id, {comments: true}), api.getCategories()]);
  res.render(`post`, {article, categories});
});

articleRoutes.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, {comments: true});
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
