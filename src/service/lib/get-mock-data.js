'use strict';

const fs = require(`fs/promises`);
const {MOCKS_FILE_PATH} = require(`../../constants`);

let data = null;

const getMockData = async () => {
  if (data !== null) {
    return data;
  }

  try {
    const content = await fs.readFile(MOCKS_FILE_PATH);
    data = JSON.parse(content);

  } catch (err) {
    console.error(err);
    throw Error(err);
  }

  return data;
};

module.exports = getMockData;
