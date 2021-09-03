const { read, remove, loader, stepLabel, resolutionCount } = require('../helpers');

const clean = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'cleaning up old resolutions', step, hint);

  const [success, resolutions] = read(target, 'package.json', 'resolutions');

  if (!success)
    return loader(verbose, spinner, 'fail', 'failed to cleanup resolutions', step, hint);
  if (!resolutions)
    return loader(verbose, spinner, 'warn', 'could not find any resolutions', step, hint);

  const response = remove(target, 'package.json', 'resolutions');

  if (response)
    loader(
      verbose,
      spinner,
      'succeed',
      `cleaned up ${resolutionCount(resolutions)} resolution${
        resolutionCount(resolutions) > 1 ? 's' : ''
      }`,
      step,
      hint
    );
  else loader(verbose, spinner, 'fail', 'failed to cleanup resolutions', step, hint);
};

module.exports = {
  clean
};
