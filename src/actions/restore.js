const ora = require('ora');
const { prefix } = require('../helpers');
const { read, write } = require('../common');

const restore = async (hint, target, config) => {
  const step = prefix(config);
  const spinner = ora(step + 'restoring package.json' + hint).start();

  const project = target.split('/').pop();
  const { resolutions } = await read(__dirname + '/../backup/', 'resolutions.json', project);

  if (!resolutions) {
    spinner.warn(step + 'skipped backup' + hint);

    return 1;
  }

  await write(target, 'package.json', { resolutions });

  spinner.succeed(step + 'restored resolutions' + hint);
  return 0;
};

module.exports = {
  restore
};
