'use strict';

const {Router} = require(`express`);
const fs = require(`fs/promises`);
const chalk = require(`chalk`);
const {HttpCode, MOCKS_FILE_PATH} = require(`../../constants`);

const postRouts = new Router();

postRouts.get(`/`, async (req, res) => {
  try {
    const mocks = await fs.readFile(MOCKS_FILE_PATH);
    const content = JSON.parse(mocks);

    if (content.length === 0) {
      res.send([]);
    } else {
      res.json(content);
    }

  } catch (err) {
    console.error(chalk.red(err.message));
    res.status(HttpCode.INTERNAL_SERVER_ERROR);
    res.send([]);
  }
});

module.exports = postRouts;
