const ora = require('ora');
const { execute } = require('../common');
const { prefix, timely, randomHold, randomFact, randomEndgame, verbosely } = require('../helpers');

const install = async (hint, target, { verbose, frozen, ...config }) => {
  const timeouts = [];
  const step = prefix(config);
  const spinner = ora(step + 'installing dependencies' + hint).start();

  if (frozen) {
    spinner.warn(step + 'skipped install' + hint);
    if (verbose) verbosely('skip reason', 'frozen mode (true)', 'last');
    return 1;
  }

  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomHold(), 5000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 30000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 60000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 90000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomEndgame(), 1200000));

  const [success, response] = await execute(`yarn --cwd ${target} install`);

  timeouts.forEach(timeout => clearTimeout(timeout));

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
