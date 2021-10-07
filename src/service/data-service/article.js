'use strict';

const Aliase = require(`../../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(needComments = false) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    const articles = await this._Article.findAll({include});
    return articles.map((it) => it.get());
  }

  async findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push(Aliase.COMMENTS);
    }
    return await this._Article.findByPk(id, {include});
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async remove(id) {
    const removedRows = await this._Article.destroy({
      where: {id}
    });
    return !!removedRows;
  }

  async upDate(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      order: [[`createdAt`, `DESC`]],
      distinct: true
    });

    return {count, rows};
  }

}

module.exports = ArticleService;
