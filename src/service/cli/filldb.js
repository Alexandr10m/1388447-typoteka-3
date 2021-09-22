'use strict';

const fs = require(`fs/promises`);
const sequelize = require(`../lib/sequelize`);
const initDataBase = require(`../lib/init-db`);
const {getLogger} = require(`../lib/logger`);
const {
  getRandomInt,
  shuffle,
  getRandomSubarray
} = require(`../../utils`);


const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DAYS_PER_MONTH = 30.4;
const MAX_MONTH = 3;
const FilePath = {
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  SENTENCES: `./data/sentences.txt`,
  COMMENTS: `./data/comments.txt`,
};
const AnnouncementBoundaries = {
  MIN: 1,
  MAX: 5,
};

const logger = getLogger({name: `fill-db`});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    logger.error(`Error in readContent function`, err);
    return [];
  }

};

const generateAnnounce = (text) => {
  return shuffle(text)
    .slice(0, getRandomInt(AnnouncementBoundaries.MIN, AnnouncementBoundaries.MAX))
    .join(` `);
};

const generateFullText = (text) => {
  return shuffle(text).slice(0, 1).join(` `);
};

const publishedDate = new Date().setDate(-getRandomInt(0, DAYS_PER_MONTH * MAX_MONTH));

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    text: shuffle(comments).slice(0, getRandomInt(1, comments.length - 1)).join(` `),
  }));
};

const generateMockData = (countMock, titles, sentences, categories, comments) => {
  return Array(countMock).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    categories: getRandomSubarray(categories),
    createdDate: new Date(publishedDate).toISOString(),
    comments: generateComments(getRandomInt(0, comments.length - 1), comments),
  }));
};

module.exports = {
  name: `--fill-db`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}. Stack: ${err.stack})`);
      throw new Error(`Error in sequelize authenticate`);
    }
    logger.info(`Connection to database established`);

    const titles = await readContent(FilePath.TITLES);
    const sentences = await readContent(FilePath.SENTENCES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);

    const [count] = args;
    const number = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (number > MAX_COUNT) {
      throw Error(`Не больше ${MAX_COUNT} публикаций`);
    }

    const articles = generateMockData(number, titles, sentences, categories, comments);

    try {
      await initDataBase(sequelize, {categories, articles, comments});
    } catch (err) {
      throw new Error(`Error in filling database`);
    }
  }
};
