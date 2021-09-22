'use strict';


class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findOne(id) {
    return await this._Comment.findByPk(id);
  }

  async create(comment, articleId) {
    return await this._Comment.create({
      articleId,
      ...comment
    });
  }

  async remove(id) {
    const removedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!removedRows;
  }

}

module.exports = CommentService;
