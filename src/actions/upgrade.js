const ora = require('ora');
const { execute } = require('../common');
const {
  prefix,
  timely,
  verbosely,
  randomHold,
  randomFact,
  randomEndgame,
  findSuccessEvent
} = require('../helpers');

const upgrade = async (hint, target, { verbose, pattern, frozen, ...config }) => {
  const step = prefix(config);
  const timeouts = [];
  const spinner = ora(step + 'upgrading dependencies' + hint).start();

  if (frozen) {
    spinner.warn(step + 'skipped upgrade' + hint);
    if (verbose) verbosely('skip reason', 'frozen mode (true)', 'last');
    return 1;
  }

  if (verbose) verbosely('used upgrading pattern', pattern, 'first');

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
    spinner.fail(step + 'upgrade failed' + hint);
    verbosely('fail reason', response, 'last');
    return 2;
  }
};

module.exports = {
  upgrade
};
