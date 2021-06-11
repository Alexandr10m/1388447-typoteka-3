'use strict';

const fs = require('fs/promises');
const {getRandomInt, shuffle} = require('../../utils');
// const {ExitCode} = require('../../constants');

const FILE_NAME = `mocks.json`;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const DAYS_PER_MONTH = 30.4;
const MAX_MONTH = 3;
const FilePath = {
  titles: `./data/titles.txt`,
  categories: `./data/categories.txt`,
  sentences: `./data/sentences.txt`,
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
    console.error(err);
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

const generateMockData = (countMock, titles, sentences, categories) => {
  return Array(countMock).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: generateAnnounce(sentences),
    fullText: generateFullText(sentences),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    createdDate: new Date(publishedDate),
  }))
};
const publishedDate = new Date().setDate(-getRandomInt(0, DAYS_PER_MONTH * MAX_MONTH));

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const number = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (number > MAX_COUNT) {
      // console.error(`Не больше 1000 публикаций`);
      throw Error(`Не больше 1000 публикаций`);
    }

    const titles = await readContent(FilePath.titles);
    const sentences = await readContent(FilePath.sentences);
    const categories = await readContent(FilePath.categories);

    const mockData = JSON.stringify(generateMockData(number, titles, sentences, categories));

    try {
      await fs.writeFile(FILE_NAME, mockData);
    } catch (err) {
      console.error(err);
    }

  }
};
