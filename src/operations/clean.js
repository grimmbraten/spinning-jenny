const { read, remove, loader, stepLabel } = require('../helpers');

const clean = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'cleaning package.json', step, hint);

  const [success, resolutions] = read(target, 'package.json', 'resolutions');

  if (!success) return loader(verbose, spinner, 'fail', 'cleanup failed', step, hint);
  if (!resolutions) return loader(verbose, spinner, 'warn', 'skipped cleanup', step, hint);

  const response = remove(target, 'package.json', 'resolutions');

  if (response) loader(verbose, spinner, 'succeed', 'cleaned package.json', step, hint);
  else loader(verbose, spinner, 'fail', 'cleanup failed', step, hint);
};

module.exports = {
  clean
};
