const ora = require('ora');
const { execute } = require('../common');
const { prefix, timely, randomHold, randomFact, randomEndgame } = require('../helpers');

const install = async (hint, target, { frozen, ...config }) => {
  const timeouts = [];
  const step = prefix(config);
  const spinner = ora(step + 'installing dependencies' + hint).start();

  if (frozen) {
    spinner.warn(step + 'skipped install' + hint);
    return 1;
  }

  timeouts.push(timely(spinner, step, 'installing dependencies', randomHold(), 5000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 30000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 60000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 90000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomEndgame(), 1200000));

  const [success, response] = await execute(`yarn --cwd ${target} install`);

  timeouts.forEach(timeout => clearTimeout(timeout));

  if (!success) {
    spinner.fail(step + `installation failed\n\n${response}` + hint);
    return 2;
  }

  spinner.succeed(step + 'installed dependencies' + hint);
  return 0;
};

module.exports = {
  install
};
