'use strict';

const http = require('http');
const fs = require('fs/promises');
const chalk = require('chalk');
const {HttpCode, Route, DEFAULT_PORT, MOCKS_FILE_PATH} = require('../../constants');

const sendMessage = (res, statusCode, content) => {
  const template = `
  <!Doctype html>
      <html lang="ru">
      <head>
        <title>My first server on project - typoteka-3</title>
      </head>
      <body>${content}</body>
    </html>`.trim();
  res.writeHead(statusCode, {'Content-Type': `text/html; charset=UTF-8`});
  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessage = `Not Found`;
  switch (req.url) {
    case Route.MAIN:
      try {
        const data = await fs.readFile(MOCKS_FILE_PATH, `utf8`);
        const content = JSON.parse(data);
        const titles = content.map((item) => `<li>${item.title}</li>`).join(``);

        sendMessage(res, HttpCode.OK, `<ul>${titles}</ul>`);

      } catch (err) {
        console.error(`Error in response: `, err.message);
        sendMessage(res, HttpCode.NOT_FOUND, notFoundMessage);
      }
      break;

    default:
      sendMessage(res, HttpCode.NOT_FOUND, notFoundMessage);
      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = +customPort || DEFAULT_PORT;
    const server = http.createServer(onClientConnect);
    server.listen(port);
    server.on(`listening`, () => console.log(chalk.green(`Waiting for connection on ${port}`)));
    server.on(`error`, ({message}) => console.error(`Server creation error: ${message}`));
  }
}
