const ora = require('ora');
const { prefix } = require('../helpers');
const { read, write } = require('../services/json');
const { warn, succeed } = require('../services/ora');

const handler = async (hint, target, config) => {
  const step = prefix(config);
  const spinner = ora(step + 'restoring package.json' + hint).start();

  const project = target.split('/').pop();
  const { resolutions } = await read(__dirname + '/../backup/', 'resolutions.json', project);

  if (!resolutions) return warn(spinner, step, hint, 'skipped backup');

  await write(target, 'package.json', { resolutions });

  return succeed(spinner, step, hint, 'restored resolutions');
};

module.exports = {
  restore: handler
};
