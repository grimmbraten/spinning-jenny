const { read, write, loader, stepLabel } = require('../helpers');

const restore = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);
  loader(verbose, spinner, 'start', 'restoring resolutions', step, hint);

  const project = target.split('/').pop();
  const { resolutions } = await read(__dirname, '../.backups.json', project);

  if (!resolutions)
    return loader(verbose, spinner, 'fail', 'failed to restore resolutions', step, hint);

  await write(target, 'package.json', { resolutions });

  loader(verbose, spinner, 'succeed', 'successfully restored resolutions', step, hint);
};

module.exports = {
  restore
};
