const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
};

const Route = {
  MAIN: `/`,
}

const USER_ARGV_INDEX = 2;

const MOCKS_FILE_PATH = 'mocks.json';

const DEFAULT_COMMAND = `--help`;

const DEFAULT_PORT = 3000;

module.exports = {ExitCode, USER_ARGV_INDEX, DEFAULT_COMMAND, HttpCode, Route, DEFAULT_PORT, MOCKS_FILE_PATH};
