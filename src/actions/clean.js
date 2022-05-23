const ora = require('ora');
const { prefix } = require('../helpers');
const { read, remove } = require('../services/json');

const clean = async (hint, target, config) => {
  const step = prefix(config);
  const spinner = ora(step + 'cleaning resolutions' + hint).start();

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) {
    spinner.warn(step + 'skipped cleanup' + hint);
    return 1;
  }

  const response = await remove(target, 'package.json', 'resolutions');

  if (!response) {
    spinner.fail(step + 'cleanup failed' + hint);
    return 2;
  }

  spinner.succeed(step + 'cleaned resolutions' + hint);
  return 0;
};

module.exports = {
  clean
};
