const ora = require('ora');
const { prefix } = require('../helpers');
const { read, remove } = require('../services/json');
const { fail, warn, succeed } = require('~services/ora');

const handler = async (hint, target, config) => {
  const step = prefix(config);
  const spinner = ora(step + 'cleaning resolutions' + hint).start();

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) return warn(spinner, step, hint, 'skipped cleanup');

  const response = await remove(target, 'package.json', 'resolutions');

  if (!response) return fail(spinner, step, hint, 'cleanup failed');

  return succeed(spinner, step, hint, 'cleaned resolutions');
};

module.exports = {
  clean: handler
};
