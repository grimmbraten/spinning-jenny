const chalk = require('chalk');
const { execute } = require('../common');
const { loader, stepLabel } = require('../helpers');

const install = async (spinner, hint, target, { verbose, frozen, ...config }) => {
  const step = stepLabel(config);

  if (frozen)
    return loader(
      verbose,
      spinner,
      'warn',
      'skipped install',
      step,
      `${hint} ${chalk.gray('[frozen: true]')}`
    );

  loader(verbose, spinner, 'start', 'installing dependencies', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} install`);

  if (success) loader(verbose, spinner, 'succeed', 'installed dependencies', step, hint);
  else loader(verbose, spinner, 'fail', 'installation failed', step, hint);

  return success ? response : undefined;
};

module.exports = {
  install
};
