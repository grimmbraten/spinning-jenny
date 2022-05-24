const ora = require('ora');
const { read, write } = require('../services/json');
const { prefix } = require('../helpers');

const backup = async (hint, target, { backup, ...config }) => {
  const backups = {};
  const step = prefix(config);
  const spinner = ora(step + 'collecting resolutions' + hint).start();

  if (!backup) {
    spinner.warn(step + 'skipped backup' + hint);
    return 1;
  }

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) {
    spinner.warn(step + 'skipped backup' + hint);
    return 1;
  }

  const project = target.split('/').pop();
  backups[project] = { resolutions, path: target, created: new Date().toString() };
  await write(__dirname + '/../backup/', 'resolutions.json', backups);

  spinner.succeed(step + 'created backup' + hint);

  return 0;
};

module.exports = {
  backup
};
