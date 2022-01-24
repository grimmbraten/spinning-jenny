const ora = require('ora');
const { prefix, verbosely } = require('../helpers');
const { read, write } = require('../common');

const restore = async (hint, target, { verbose, ...config }) => {
  const step = prefix(config);
  const spinner = ora(step + 'restoring package.json' + hint).start();

  const project = target.split('/').pop();
  const { resolutions } = await read(__dirname, '../.backups.json', project);

  if (!resolutions) {
    spinner.warn(step + 'skipped backup' + hint);
    if (verbose) verbosely('skip reason', 'no resolutions found', 'last');
    return 1;
  } else if (verbose) verbosely(`fetched resolutions from ${target}/package.json`, resolutions);

  await write(target, 'package.json', { resolutions });

  spinner.succeed(step + 'restored resolutions' + hint);
  return 0;
};

module.exports = {
  restore
};
