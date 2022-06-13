const ora = require('ora');
const { shell } = require('~services/shelljs');
const { fail, warn, succeed } = require('~services/ora');
const { prefix, timely, checkpoints } = require('~helpers');

const handler = async (hint, target, { frozen, ...config }) => {
  const timeouts = [];

  const step = prefix(config);
  const spinner = ora(step + 'installing dependencies' + hint).start();

  if (frozen) return warn(spinner, step, hint, 'skipped install');

  checkpoints.forEach(({ time, content }) =>
    timeouts.push(timely(spinner, step, 'installing dependencies', content, time))
  );

  const [success, response] = await shell(`yarn --cwd ${target} install`);

  timeouts.forEach(timeout => clearTimeout(timeout));

  if (!success) return fail(spinner, step, hint, 'installation failed', response);

  return succeed(spinner, step, hint, 'installed dependencies');
};

module.exports = {
  install: handler
};
