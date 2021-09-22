'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const {HttpCode} = require(`../../constants`);
const DataService = require(`../data-service/category`);

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
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [
      `Деревья`,
      `За жизнь`,
      `Без рамки`,
    ],
    "comments": [],
  },
  {
    "title": `Борьба с прокрастинацией`,
    "announce": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться`,
    "categories": [
      `Без рамки`,
      `Разное`
    ],
    "comments": [],
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, comments: mockComments});
  category(app, new DataService(mockDB));
});

describe(`API return category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status  code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 8 categories`, () => expect(response.body.length).toBe(8));

  test(`Category names are "Деревья", "За жизнь", "Без рамки", "Разное", "IT", "Музыка", "Кино", "Программирование"`, () => {
    return expect(response.body.map((it) => it.name)).toEqual(mockCategories);
  });
});
