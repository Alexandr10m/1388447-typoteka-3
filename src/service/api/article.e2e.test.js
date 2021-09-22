'use strict';

const express = require(`express`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const request = require(`supertest`);
const article = require(`./article`);
const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);


const mockComments = [
  `Это где ж такие красоты?`,
  `Согласен с автором!`
];

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`
];

const mockArticles = [
  {
    "title": `Как начать программировать`,
    "announce": `Ёлки — это не просто красивое дерево.`,
    "fullText": ` Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [
      `Деревья`,
      `За жизнь`,
      `Программирование`
    ],
    "comments": []
  },
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Это прочная древесина.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "categories": [
      `Без рамки`,
      `Разное`
    ],
    "comments": []
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

  const app = express();
  app.use(express.json());
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, comments: mockComments});
  article(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 2 articles`, () => expect(response.body.length).toBe(2));

  test(`First article's title equals 'Как начать программировать'`, () => expect(response.body[0].title).toBe(mockArticles[0].title));

});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is 'Как начать программировать'`, () => expect(response.body.title).toBe(`Как начать программировать`));

});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title": `Программировать - это легко!`,
    "announce": `Первая большая ёлка была установлена`,
    "fullText": `Вы можете достичь всего.`,
    "categories": [1, 2],
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => request(app).get(`/articles`).expect((res) => expect(res.body[2].title).toBe(newArticle.title)));

  test(`Article count is changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(3)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    "title": `Программировать - это легко!`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "categories": [
      `IT`,
      `Программирование`
    ],
  };
  let app;
  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const inValidArticle = {...newArticle};
      delete inValidArticle[key];
      await request(app)
        .post(`/articles`)
        .send(inValidArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    "title": `Программировать - это легко!`,
    "announce": `Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Вы можете достичь всего.`,
    "categories": [
      `IT`,
      `Программирование`
    ],
    "comments": []
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/articles/1`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`Программировать - это легко!`)));
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const app = await createAPI();
  const validArticle = {
    "title": `Как начать программировать`,
    "announce": `Это прочная древесина.`,
    "fullText": `Ёлки — это не просто красивое дерево.`,
    "categories": [
      `Деревья`,
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `IT`,
      `Музыка`,
      `Кино`,
      `Программирование`
    ],
    "comments": []
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const app = await createAPI();
  const inValidArticle = {
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "createdDate": `2021-04-13T07:44:41.958Z`,
    "comments": []
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(inValidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns articles with decreased length`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(1)));

  test(`Articles count is 1 now`, async () => await request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent article`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {

  const app = await createAPI();

  return request(app)
    .post(`/article/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, async () => {

  const app = await createAPI();

  return request(app)
    .delete(`/articles/5bm7bn/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

