const { read, write, loader, stepLabel } = require('../helpers');

const backup = async (spinner, hint, target, { verbose, ...config }) => {
  const backup = {};
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'searching for resolutions', step, hint);

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions)
    return loader(verbose, spinner, 'warn', 'could not find any resolutions', step, hint);

  const project = target.split('/').pop();
  backup[project] = { resolutions, date: new Date().toString() };
  await write(__dirname, '../.backups.json', backup);

  loader(verbose, spinner, 'succeed', 'successfully saved resolutions', step, hint);
};

module.exports = {
  backup
};
