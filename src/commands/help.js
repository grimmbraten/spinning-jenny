const { shell } = require('../services/shelljs');
const { repository } = require('../../package.json');

const help = async () => {
  await shell(`open ${repository.url}`);
};

module.exports = {
  help
};
