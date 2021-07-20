'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_LENGTH_ID} = require(`../../constants`);

class CommentService {

  findAll(article) {
    return article.comments;
  }

  findOne(id, article) {
    const comment = article.comments.find((item) => item.id === id);

    if (!comment) {
      return null;
    }
    return comment;
  }

  create(comment, article) {
    const newComment = Object.assign({id: nanoid(MAX_LENGTH_ID)}, comment);
    article.comments.push(newComment);

    return newComment;
  }

  remove(id, article) {
    const [comment] = article.comments.filter((item) => item.id === id);

    if (!comment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== id);

    return comment;
  }

}

module.exports = CommentService;
