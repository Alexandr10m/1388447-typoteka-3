'use strict';

const {HttpCode} = require(`../../constants`);
const {logger} = require(`../lib/logger`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const {comments} = req.query;

  try {
    const article = await service.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Article with ${articleId} not found`);
    }

    res.locals.article = article;
    return next();
  } catch (err) {
    logger.error(`An error occurred on processing request: ${err.message}`);
  }

};
