'use strict';

const fs = require('fs/promises');
const {getRandomInt, shuffle} = require('../../utils');
const chalk = require('chalk');

const FILE_NAME = `mocks.json`;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DAYS_PER_MONTH = 30.4;
const MAX_MONTH = 3;
const FilePath = {
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  SENTENCES: `./data/sentences.txt`,
}
const AnnouncementBoundaries = {
  MIN: 1,
  MAX: 5,
}

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);

  } catch (err) {
    console.error(chalk.red(`Error in readContent function`, err));
    return [];
  }

}
const generateAnnounce = (text) => {
  return shuffle(text)
    .slice(0, getRandomInt(AnnouncementBoundaries.MIN, AnnouncementBoundaries.MAX))
    .join(` `);
}

const generateFullText = (text) => {
  return shuffle(text).slice(0, getRandomInt(1, text.length - 1)).join(` `);
}

const publishedDate = new Date().setDate(-getRandomInt(0, DAYS_PER_MONTH * MAX_MONTH));

const generateMockData = (countMock, titles, sentences, categories) => {
  return Array(countMock).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    createdDate: new Date(publishedDate).toISOString(),
  }))
};


module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FilePath.TITLES);
    const sentences = await readContent(FilePath.SENTENCES);
    const categories = await readContent(FilePath.CATEGORIES);

    const [count] = args;
    const number = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (number > MAX_COUNT) {
      throw Error(`Не больше ${MAX_COUNT} публикаций`);
    }

    const mockData = JSON.stringify(generateMockData(number, titles, sentences, categories));

    try {
      await fs.writeFile(FILE_NAME, mockData);
      console.log(chalk.green(`Operation success. File created.`));

    } catch (err) {
      throw new Error(`Error in generate command`);
    }
  }
};
