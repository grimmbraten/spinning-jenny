const ora = require('ora');
const { read, write } = require('../common');
const { prefix, verbosely } = require('../helpers');

const backup = async (hint, target, { verbose, ...config }) => {
  const backup = {};
  const step = prefix(config);
  const spinner = ora(step + 'collecting resolutions' + hint).start();

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions) {
    spinner.warn(step + 'skipped backup' + hint);
    if (verbose) verbosely('skip reason', 'no resolutions found', 'last');
    return 1;
  } else if (verbose) verbosely(`fetched resolutions from ${target}/package.json`, resolutions);

  const project = target.split('/').pop();
  if (verbose) verbosely('fetched project name from path', project);

  backup[project] = { resolutions, path: target, created: new Date().toString() };
  await write(__dirname + '/../backup/', 'resolutions.json', backup);

  spinner.succeed(step + 'created backup' + hint);
  if (verbose) verbosely('backup created at', new Date().toString(), 'last');
  return 0;
};

module.exports = {
  backup
};
