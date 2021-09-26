const chalk = require('chalk');
const { execute } = require('../common');
const { loader, stepLabel, parseJson, extractUpgradeOutcome } = require('../helpers');

const upgrade = async (spinner, hint, target, { verbose, pattern, frozen, ...config }) => {
  const step = stepLabel(config);

  if (frozen)
    return loader(
      verbose,
      spinner,
      'warn',
      'skipped upgrade',
      step,
      `${hint} ${chalk.gray('[frozen: true]')}`
    );

  loader(verbose, spinner, 'start', 'upgrading dependencies', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} upgrade ${pattern} --json`);

  return loader(
    verbose,
    spinner,
    'succeed',
    success ? extractUpgradeOutcome(parseJson(response)) || 'upgrade failed' : 'upgrade failed',
    step,
    hint
  );
};

module.exports = {
  upgrade
};
