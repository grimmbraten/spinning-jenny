const { execute } = require('../common');
const { repository } = require('../../package.json');

const help = async () => {
  await execute(`open ${repository.url}`);
};

module.exports = {
  help
};
