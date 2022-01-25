const ora = require('ora');
const { execute } = require('../common');
const { prefix, timely, verbosely, findSuccessEvent } = require('../helpers');

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

  timeouts.push(
    timely(
      spinner,
      step,
      'upgrading dependencies',
      'this may take a while, please be patient',
      5000
    )
  );

  timeouts.push(
    timely(
      spinner,
      step,
      'upgrading dependencies',
      'do not worry, jenny is still upgrading dependencies',
      30000
    )
  );

  timeouts.push(
    timely(
      spinner,
      step,
      'upgrading dependencies',
      'did you know that a plateau is the highest form of flattery?',
      60000
    )
  );

  timeouts.push(
    timely(
      spinner,
      step,
      'upgrading dependencies',
      'how old did you say that this project was again?',
      90000
    )
  );

  timeouts.push(
    timely(spinner, step, 'upgrading dependencies', 'At least there is no "I" in Denial', 90000)
  );

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
