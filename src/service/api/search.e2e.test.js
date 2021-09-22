'use strict';

const express = require(`express`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const request = require(`supertest`);
const search = require(`./search`);
const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/search`);


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
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего.`,
    "categories": [
      `Деревья`,
      `За жизнь`,
      `Без рамки`
    ],
    "comments": []
  },
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Ёлки — это не просто красивое дерево. `,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "categories": [
      `Разное`
    ],
    "comments": []
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, comments: mockComments});
  search(app, new DataService(mockDB));
});

describe(`API return article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({query: `начать программировать`});
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(` 1 article found`, () => expect(response.body.length).toBe(1));

  test(`Article has correct title`, () => expect(response.body[0].title).toBe(mockArticles[0].title));

});

describe(`API return Error`, () => {
  test(`API returns code 404 if nothing is found`, async () => {
    return await request(app)
      .get(`/search`)
      .query({query: `r`})
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns 400 when query string is absent`, async () => {
    return await request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST);
  });
});
