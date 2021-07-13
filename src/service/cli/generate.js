'use strict';

const fs = require(`fs/promises`);
const {nanoid} = require(`nanoid`);
const {getRandomInt, shuffle} = require(`../../utils`);
const chalk = require(`chalk`);
const {MAX_LENGTH_ID, MOCKS_FILE_PATH} = require(`../../constants`);

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

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    console.error(chalk.red(`Error in readContent function`, err));
    return [];
  }

};
const generateAnnounce = (text) => {
  return shuffle(text)
    .slice(0, getRandomInt(AnnouncementBoundaries.MIN, AnnouncementBoundaries.MAX))
    .join(` `);
};

const generateFullText = (text) => {
  return shuffle(text).slice(0, getRandomInt(1, text.length - 1)).join(` `);
};

const publishedDate = new Date().setDate(-getRandomInt(0, DAYS_PER_MONTH * MAX_MONTH));

const generateComments = (count, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_LENGTH_ID),
    text: shuffle(comments).slice(0, getRandomInt(1, comments.length - 1)).join(` `),
  }));
};

const generateMockData = (countMock, titles, sentences, categories, comments) => {
  return Array(countMock).fill({}).map(() => ({
    id: nanoid(MAX_LENGTH_ID),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    createdDate: new Date(publishedDate).toISOString(),
    comments: generateComments(getRandomInt(0, comments.length - 1), comments),
  }));
};


module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FilePath.TITLES);
    const sentences = await readContent(FilePath.SENTENCES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);

    const [count] = args;
    const number = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (number > MAX_COUNT) {
      throw Error(`Не больше ${MAX_COUNT} публикаций`);
    }

    const mockData = JSON.stringify(generateMockData(number, titles, sentences, categories, comments));

    try {
      await fs.writeFile(MOCKS_FILE_PATH, mockData);
      console.log(chalk.green(`Operation success. File created.`));

    } catch (err) {
      throw new Error(`Error in generate command`);
    }
  }
};
