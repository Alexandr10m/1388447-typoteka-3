'use strict';

const defineModels = require(`../../models`);
const Aliase = require(`../../models/aliase`);

module.exports = async (sequelize, {categories, articles, comments}) => {
  const {Category, Article, Comment} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((category) => ({name: category}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const commentModels = await Comment.bulkCreate(
      comments.map((comment) => ({text: comment}))
  );

  const commentIdByName = commentModels.reduce((acc, next) => ({
    [next.text]: next.id,
    ...acc
  }), {});

  const ArticlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});

    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name]
        )
    );

    await articleModel.addComments(
        article.comments.map(
            (text) => commentIdByName[text]
        )
    );
  });

  await Promise.all(ArticlePromises);
};
