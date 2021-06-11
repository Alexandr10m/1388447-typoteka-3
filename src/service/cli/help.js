const {name: version} = require('./version');
const {name: generate} = require('./generate');

const text = `Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mocks.json`;

module.exports = {
  name: `--help`,
  run() {
    console.log(`
    Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
    service.js <command>
    Команды:
    ${version}:            выводит номер версии
    ${this.name}:               печатает этот текст
    ${generate}: <count>   формирует файл mocks.json

    `
    );
  }
}
