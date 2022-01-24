const ora = require('ora');
const { prefix, verbosely } = require('../helpers');
const { read, remove } = require('../common');

const clean = async (hint, target, { verbose, ...config }) => {
  const step = prefix(config);
  const spinner = ora(step + 'cleaning resolutions' + hint).start();

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) {
    spinner.warn(step + 'skipped cleanup' + hint);
    if (verbose) verbosely('skip reason', 'no resolutions found', 'last');
    return 1;
  } else if (verbose) verbosely(`fetched resolutions from ${target}/package.json`, resolutions);

  const response = await remove(target, 'package.json', 'resolutions');

  if (!response) {
    spinner.fail(step + `failed to cleanup resolutions` + hint);
    if (verbose) verbosely('remove failed', response, 'last');
    return 2;
  }

  spinner.succeed(step + 'cleaned resolutions' + hint);
  if (verbose) verbosely('cleaned up resolution count', resolutions.length, 'last');
  return 0;
};

module.exports = {
  clean
};
