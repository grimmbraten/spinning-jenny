const ora = require('ora');
const { shell } = require('../services/shelljs');
const { prefix, timely, randomHold, randomFact, randomEndgame } = require('../helpers');

const install = async (hint, target, { frozen, ...config }) => {
  const timeouts = [];
  const step = prefix(config);
  const spinner = ora(step + 'installing dependencies' + hint).start();

  if (frozen) {
    spinner.warn(step + 'skipped install' + hint);
    return 1;
  }

  timeouts.push(timely(spinner, step, 'installing dependencies', randomHold(), 2500));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 15000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 30000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 45000));
  timeouts.push(timely(spinner, step, 'installing dependencies', randomEndgame(), 600000));

  const [success, response] = await shell(`yarn --cwd ${target} install`);

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
