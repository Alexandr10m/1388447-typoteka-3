'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExist = require(`../middleware/article-exist`);
const articleValidator = require(`../middleware/article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
const catchError = require(`../middleware/catcherError`);

module.exports = (app, articleService, commentService) => {
  const router = new Router();

  app.use(`/articles`, router);

  router.get(`/`, catchError(async (req, res) => {
    const {limit, offset, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset});
    } else {
      result = await articleService.findAll(comments);
    }
    res.status(HttpCode.OK)
      .json(result);
  }));

  router.get(`/:articleId`, articleExist(articleService), catchError(async (req, res) => {
    const {article} = await res.locals;
    res.status(HttpCode.OK)
      .json(article);
  }));

  router.post(`/`, articleValidator, catchError(async (req, res) => {
    const article = await articleService.create(req.body);
    res.status(HttpCode.CREATED)
      .json(article);
  }));

  router.put(`/:articleId`, [articleValidator, articleExist(articleService)], catchError(async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.upDate(articleId, req.body);

    res.status(HttpCode.OK)
      .json(article);
  }));

  router.delete(`/:articleId`, articleExist(articleService), catchError(async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.remove(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Article ${articleId} not found`);
      return;
    }
    res.status(HttpCode.OK)
      .json(article);
  }));

  router.get(`/:articleId/comments`, articleExist(articleService), catchError(async (req, res) => {
    const {article} = await res.locals;
    const comments = await commentService.findAll(article.id);

    res.status(HttpCode.OK)
      .json(comments);
  }));

  router.delete(`/:articleId/comments/commentId`, articleExist(articleService), catchError(async (req, res) => {
    const {commentId} = req.params;
    const comment = await commentService.findOne(commentId);

    if (!comment) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Comment ${commentId} not found`);
      return;
    }

    res.status(HttpCode.OK)
      .json(comment);
  }));

  router.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], catchError(async (req, res) => {
    const {article} = await res.locals;
    const comment = await commentService.create(req.body, article.id);

    res.status(HttpCode.OK)
      .json(comment);
  }));
};
