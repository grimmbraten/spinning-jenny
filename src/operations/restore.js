const { read, write, loader, stepLabel } = require('../helpers');

const restore = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);
  loader(verbose, spinner, 'start', 'restoring package.json', step, hint);

  const project = target.split('/').pop();
  const { resolutions } = await read(__dirname, '../.backups.json', project);

  if (!resolutions) return loader(verbose, spinner, 'fail', 'restoration failed', step, hint);

  await write(target, 'package.json', { resolutions });

  loader(verbose, spinner, 'succeed', 'restored package.json', step, hint);
};

module.exports = {
  restore
};
