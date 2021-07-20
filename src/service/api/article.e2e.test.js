'use strict';

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const mockData = [
  {
    "id": `5bm7bn`,
    "title": `Как начать программировать`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `Деревья`,
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `IT`,
      `Музыка`,
      `Кино`,
      `Программирование`
    ],
    "createdDate": `2021-04-13T07:44:41.958Z`,
    "comments": []
  },
  {
    "id": `W80paB`,
    "title": `Борьба с прокрастинацией`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха. Это один из лучших рок-музыкантов. Он написал больше 30 хитов.`,
    "category": [
      `Деревья`,
      `За жизнь`,
      `Без рамки`,
      `Разное`
    ],
    "createdDate": `2021-04-13T07:44:41.958Z`,
    "comments": []
  },
];

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns a list of 2 articles`, () => expect(response.body.length).toBe(2));

  test(`First article's id equals '5bm7bn'`, () => expect(response.body[0].id).toBe(`5bm7bn`));

});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/5bm7bn`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Article's title is 'Как начать программировать'`, () => expect(response.body.title).toBe(`Как начать программировать`));

});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    "title": `Программировать - это легко!`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `IT`,
      `Программирование`
    ],
    "createdDate": `2021-03-13T07:41:41.958Z`,
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article count is changed`, () => request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(3)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    "title": `Программировать - это легко!`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `IT`,
      `Программирование`
    ],
    "createdDate": `2021-03-13T07:41:41.958Z`,
  };
  const app = createAPI();

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
    "id": `5bm7bn`,
    "title": `Программировать - это легко!`,
    "announce": `Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `IT`,
      `Программирование`
    ],
    "createdDate": `2021-04-13T07:44:41.958Z`,
    "comments": []
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/5bm7bn`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`/articles/5bm7bn`)
    .expect((res) => expect(res.body.title).toBe(`Программировать - это легко!`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createAPI();
  const validArticle = {
    "title": `Как начать программировать`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    "category": [
      `Деревья`,
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `IT`,
      `Музыка`,
      `Кино`,
      `Программирование`
    ],
    "createdDate": `2021-04-13T07:44:41.958Z`,
    "comments": []
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();
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

describe(`API correctly delets an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/5bm7bn`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`5bm7bn`));

  test(`Articles count is 1 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {

  const app = createAPI();

  return request(app)
    .post(`/article/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/5bm7bn/comments/NOEXST`)
    .expect(HttpCode.NOT_FOUND);

});

