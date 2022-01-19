const chalk = require('chalk');
const { audit } = require('../common');
const { loader, prefix, colorSeverity, findAdvisories } = require('../helpers');

const patches = async (spinner, hint, target, { verbose, ...config }) => {
  let output = '';
  const step = prefix(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return loader(verbose, spinner, 'fail', 'scan failed', step, hint);

  loader(verbose, spinner, 'text', 'analyzing vulnerabilities', step, hint);

  const advisories = findAdvisories(response);

  const unique = [...new Set(advisories.map(advisory => advisory.module))];

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));
  const patchCount = patches.length;

  if (patchCount === 0) return loader(verbose, spinner, 'warn', 'skipped patches', '', hint);

  patches.sort((a, b) => a.time - b.time);

  patches.forEach(patch => {
    output += `\n\n${patch.module} @ ${patch.version} ${colorSeverity(patch.severity)}\n${
      patch.recommendation !== 'none' ? patch.recommendation : 'could not find any recommendation'
    } ${
      patch.patchedVersions !== '<0.0.0' ? `${chalk.green('(patched)')}` : chalk.red('(unsolved)')
    }\n${patch.references}\n${chalk.gray(
      `${patch.foundBy ? `${patch.foundBy} @ ` : ''}${patch.updated || patch.created}`
    )}`;
  });

  console.log(`${output}\n`);

  return loader(
    verbose,
    spinner,
    'succeed',
    `found ${patchCount} ${patchCount > 1 ? 'advisories' : 'advisory'}`,
    '',
    hint
  );
};

module.exports = {
  patches
};
