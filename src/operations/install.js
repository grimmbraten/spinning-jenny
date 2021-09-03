const { execute } = require('../shell');
const { loader, stepLabel } = require('../helpers');

const install = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'installing packages', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} install`);

  if (success) loader(verbose, spinner, 'succeed', 'successfully installed packages', step, hint);
  else loader(verbose, spinner, 'fail', 'failed to installed packages', step, hint);

  return success ? response : undefined;
};

module.exports = {
  install
};
