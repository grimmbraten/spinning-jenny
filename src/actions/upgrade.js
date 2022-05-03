const ora = require('ora');
const { execute } = require('../common');
const {
  prefix,
  timely,
  randomHold,
  randomFact,
  randomEndgame,
  findSuccessEvent
} = require('../helpers');

const upgrade = async (hint, target, { frozen, upgrade, ...config }) => {
  const step = prefix(config);
  const timeouts = [];
  const spinner = ora(step + 'upgrading dependencies' + hint).start();

  if (!upgrade) {
    spinner.warn(step + 'skipped upgrade' + hint);
    return 1;
  }

  if (frozen) {
    spinner.warn(step + 'skipped upgrade' + hint);
    return 1;
  }

  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomHold(), 5000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 30000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 60000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 90000));
  timeouts.push(timely(spinner, step, 'upgrading dependencies', randomEndgame(), 1200000));

  const [success, response] = await execute(`yarn --cwd ${target} upgrade --json`);

  timeouts.forEach(timeout => clearTimeout(timeout));

  if (success) {
    spinner.succeed(
      step + findSuccessEvent(response) || 'upgraded dependencies without any issues' + hint
    );
    return 0;
  } else {
    spinner.fail(step + `upgrade failed\n\n${response}` + hint);
    return 2;
  }
};

module.exports = {
  upgrade
};
