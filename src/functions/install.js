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

  const [success] = await execute(`yarn --cwd ${target} install`);

  return loader(
    verbose,
    spinner,
    success ? 'succeed' : 'fail',
    success ? 'installed dependencies' : 'installation failed',
    step,
    hint
  );
};

module.exports = {
  install
};
