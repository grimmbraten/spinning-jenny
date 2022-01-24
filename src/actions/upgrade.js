const ora = require('ora');
const { execute } = require('../common');
const { prefix, verbosely, findSuccessEvent } = require('../helpers');

const upgrade = async (hint, target, { verbose, pattern, frozen, ...config }) => {
  const step = prefix(config);
  const spinner = ora(step + 'upgrading dependencies' + hint).start();

  if (frozen) {
    spinner.warn(step + 'skipped upgrade' + hint);
    if (verbose) verbosely('skip reason', 'frozen mode (true)', 'last');
    return 1;
  }

  if (verbose) verbosely('upgrading pattern', pattern);

  const [success, response] = await execute(`yarn --cwd ${target} upgrade ${pattern} --json`);

  if (success) {
    spinner.succeed(step + findSuccessEvent(response) + hint);
    return 0;
  } else {
    spinner.fail(step + 'upgrade failed' + hint);
    verbosely('fail reason', response, 'last');
    return 2;
  }
};

module.exports = {
  upgrade
};
