const ora = require('ora');
const { execute } = require('../common');
const { prefix, verbosely } = require('../helpers');

const install = async (hint, target, { verbose, frozen, ...config }) => {
  const step = prefix(config);
  const spinner = ora(step + 'installing dependencies' + hint).start();

  if (frozen) {
    spinner.warn(step + 'skipped install' + hint);
    if (verbose) verbosely('skip reason', 'frozen mode (true)', 'last');
    return 1;
  }

  const [success, response] = await execute(`yarn --cwd ${target} install`);

  if (!success) {
    spinner.fail(step + 'installation failed' + hint);
    if (verbose) verbosely('fail reason', response, 'last');
    return 2;
  }

  spinner.succeed(step + 'installed dependencies' + hint);
  return 0;
};

module.exports = {
  install
};
