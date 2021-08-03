'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExist = require(`../middleware/article-exist`);
const articleValidator = require(`../middleware/article-validator`);
const commentValidator = require(`../middleware/comment-validator`);
// const {getLogger} = require(`../lib/logger`);


module.exports = (app, articleService, commentService) => {
  const router = new Router();
  // const logger = getLogger({name: `api/articles`});

  // app.use((req, res, next) => {
  //   logger.debug(`Request on route ${req.url}`);
  //   res.on(`finish`, () => {
  //     logger.info(`Response status code ${res.statusCode}`);
  //   });
  //   next();
  // });
  // app.use((err, _req, _res, _next) => {
  //   logger.error(`An error occurred on processing request: ${err.message}`);
  // });

  app.use(`/articles`, router);

  // app.use((req, res) => {
  //   res.status(HttpCode.NOT_FOUND);
  //   logger.error(`Route not found: ${req.url}`);
  // });

  router.get(`/`, (req, res) => {
    const articles = articleService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });

  router.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    res.status(HttpCode.OK)
      .json(article);
  });

  router.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    res.status(HttpCode.CREATED)
      .json(article);
  });

  router.put(`/:articleId`, [articleValidator, articleExist(articleService)], (req, res) => {
    const {articleId} = req.params;
    const article = articleService.upDate(articleId, req.body);

    res.status(HttpCode.OK)
      .json(article);
  });

  router.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    const article = articleService.remove(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Article ${articleId} not found`);
    }
    return res.status(HttpCode.OK)
      .json(article);
  });

  router.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  router.delete(`/:articleId/comments/commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const comment = commentService.findOne(commentId, article);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Comment ${commentId} not found`);
    }
    return res.status(HttpCode.OK)
      .json(comment);
  });

  router.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(req.body, article);

    res.status(HttpCode.OK)
      .json(comment);
  });
};
