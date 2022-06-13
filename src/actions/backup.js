const ora = require('ora');
const { prefix } = require('~helpers');
const { read, write } = require('~services/json');
const { warn, succeed } = require('~services/ora');

const handler = async (hint, target, { backup, ...config }) => {
  const backups = {};
  const step = prefix(config);
  const spinner = ora(step + 'collecting resolutions' + hint).start();

  if (!backup) return warn(spinner, step, hint, 'skipped backup');

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) return warn(spinner, step, hint, 'skipped backup');

  const project = target.split('/').pop();
  backups[project] = { resolutions, path: target, created: new Date().toString() };
  await write(__dirname + '/../backup/', 'resolutions.json', backups);

  return succeed(spinner, step, hint, 'created backup');
};

module.exports = {
  backup: handler
};
