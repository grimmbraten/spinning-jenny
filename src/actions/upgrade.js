const chalk = require('chalk');
const { execute } = require('../common');
const { loader, prefix, findSuccessEvent } = require('../helpers');

const upgrade = async (spinner, hint, target, { pattern, frozen, ...config }) => {
  const step = prefix(config);

  if (frozen)
    return loader(
      spinner,
      'warn',
      'skipped upgrade',
      step,
      `${hint} ${chalk.gray('[frozen: true]')}`
    );

  loader(spinner, 'start', 'upgrading dependencies', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} upgrade ${pattern} --json`);

  return loader(
    spinner,
    success ? 'succeed' : 'fail',
    success ? findSuccessEvent(response) || 'upgrade failed' : 'upgrade failed',
    step,
    hint
  );
};

module.exports = {
  upgrade
};
