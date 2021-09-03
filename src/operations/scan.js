const { execute } = require('../shell');
const { loader, stepLabel, parseJson, scannedDependencies } = require('../helpers');

const scan = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'scanning package.json', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} audit --json`);

  if (success)
    loader(
      verbose,
      spinner,
      'succeed',
      `scanned ${scannedDependencies(parseJson(response))} dependencies`,
      step,
      hint
    );
  else loader(verbose, spinner, 'fail', 'failed to scan package.json', step, hint);

  return success ? response : undefined;
};

module.exports = {
  scan
};
