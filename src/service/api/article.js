'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExist = require(`../middleware/article-exist`);
const articleValidator = require(`../middleware/article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
const {getLogger} = require(`../lib/logger`);


module.exports = (app, articleService, commentService) => {
  const router = new Router();
  const logger = getLogger({name: `api/articles`});

  app.use(`/articles`, router);

  router.get(`/`, async (req, res) => {
    const {comments} = req.query;
    try {
      const articles = await articleService.findAll(comments);
      res.status(HttpCode.OK)
        .json(articles);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }
  });

  router.get(`/:articleId`, articleExist(articleService), async (req, res) => {
    try {
      const {article} = await res.locals;
      res.status(HttpCode.OK)
        .json(article);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }
  });

  router.post(`/`, articleValidator, async (req, res) => {
    try {
      const article = await articleService.create(req.body);
      res.status(HttpCode.CREATED)
        .json(article);

    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }
  });

  router.put(`/:articleId`, [articleValidator, articleExist(articleService)], async (req, res) => {
    const {articleId} = req.params;
    try {
      const article = await articleService.upDate(articleId, req.body);

      res.status(HttpCode.OK)
        .json(article);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }

  });

  router.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    try {
      const article = await articleService.remove(articleId);

      if (!article) {
        res.status(HttpCode.NOT_FOUND)
          .send(`Article ${articleId} not found`);
        return;
      }
      res.status(HttpCode.OK)
        .json(article);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }
  });

  router.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    try {
      const {article} = await res.locals;
      const comments = await commentService.findAll(article.id);

      res.status(HttpCode.OK)
        .json(comments);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }

  });

  router.delete(`/:articleId/comments/commentId`, articleExist(articleService), async (req, res) => {
    try {
      const {commentId} = req.params;
      const comment = await commentService.findOne(commentId);

      if (!comment) {
        res.status(HttpCode.NOT_FOUND)
          .send(`Comment ${commentId} not found`);
        return;
      }

      res.status(HttpCode.OK)
        .json(comment);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }
  });

  router.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    try {
      const {article} = await res.locals;
      const comment = await commentService.create(req.body, article.id);

      res.status(HttpCode.OK)
        .json(comment);
    } catch (err) {
      logger.error(`An error occurred on processing request: ${err.message}`);
    }
  });
};
