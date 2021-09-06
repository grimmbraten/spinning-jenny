const { execute } = require('../shell');
const { loader, stepLabel, parseJson, extractUpgradeOutcome } = require('../helpers');

const upgrade = async (spinner, hint, target, { verbose, pattern, ...config }) => {
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'upgrading dependencies', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} upgrade ${pattern} --json`);

  if (success) {
    const outcome = extractUpgradeOutcome(parseJson(response));

    if (!outcome) return undefined;

    loader(verbose, spinner, 'succeed', outcome, step, hint);
  } else loader(verbose, spinner, 'fail', 'upgrade failed', step, hint);

  return success ? response : undefined;
};

module.exports = {
  upgrade
};
