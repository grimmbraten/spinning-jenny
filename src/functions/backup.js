const { read, write } = require('../common');
const { loader, prefix } = require('../helpers');

const backup = async (spinner, hint, target, { verbose, ...config }) => {
  const backup = {};
  const step = prefix(config);

  loader(verbose, spinner, 'start', 'creating backup', step, hint);

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) return loader(verbose, spinner, 'warn', 'skipped backup', step, hint);

  const project = target.split('/').pop();
  backup[project] = { resolutions, date: new Date().toString() };
  await write(__dirname + '/../backup/', '.resolutions.json', backup);

  return loader(verbose, spinner, 'succeed', 'created backup', step, hint);
};

module.exports = {
  backup
};