const {version} = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    console.log(version);
  }
}
