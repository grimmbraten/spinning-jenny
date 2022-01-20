const { read, remove } = require('../common');
const { loader, prefix } = require('../helpers');

const clean = async (spinner, hint, target, { verbose, ...config }) => {
  const step = prefix(config);
  loader(verbose, spinner, 'start', 'cleaning package.json', step, hint);

  const resolutions = await read(target, 'package.json', 'resolutions');
  if (!resolutions) return loader(verbose, spinner, 'warn', 'skipped cleanup', step, hint);

  const response = await remove(target, 'package.json', 'resolutions');
  if (!response) return loader(verbose, spinner, 'fail', 'cleanup failed', step, hint);

  return loader(verbose, spinner, 'succeed', 'cleaned package.json', step, hint);
};

module.exports = {
  clean
};
