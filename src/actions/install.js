const chalk = require('chalk');
const { execute } = require('../common');
const { loader, prefix } = require('../helpers');

const install = async (spinner, hint, target, { frozen, ...config }) => {
  const step = prefix(config);

  if (frozen)
    return loader(
      spinner,
      'warn',
      'skipped install',
      step,
      `${hint} ${chalk.gray('[frozen: true]')}`
    );

  loader(spinner, 'start', 'installing dependencies', step, hint);

  const [success] = await execute(`yarn --cwd ${target} install`);

  return loader(
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
