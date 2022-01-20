const { read, write } = require('../common');
const { loader, prefix } = require('../helpers');

const restore = async (spinner, hint, target, config) => {
  const step = prefix(config);
  loader(spinner, 'start', 'restoring package.json', step, hint);

  const project = target.split('/').pop();
  const { resolutions } = await read(__dirname, '../.backups.json', project);

  if (!resolutions) return loader(spinner, 'fail', 'restoration failed', step, hint);

  await write(target, 'package.json', { resolutions });

  return loader(spinner, 'succeed', 'restored resolutions', step, hint);
};

module.exports = {
  restore
};
