const chalk = require('chalk');
const { read } = require('../common');

const load = async () => {
  const config = await read(__dirname, '.properties.json');

  config.steps = { total: 0, completed: 0 };
  config.getStep = () => chalk.gray(`${config.steps.completed + 1}/${config.steps.total} `);

  return config;
};

module.exports = {
  load
};
