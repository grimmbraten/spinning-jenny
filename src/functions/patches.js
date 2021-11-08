const chalk = require('chalk');
const { audit } = require('../common');
const { loader, prefix, colorSeverity, findAdvisories } = require('../helpers');

const patches = async (spinner, hint, target, { verbose, ...config }) => {
  let auditAdvisory = '';
  const step = prefix(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return loader(verbose, spinner, 'fail', 'scan failed', step, hint);

  loader(verbose, spinner, 'text', 'analyzing vulnerabilities', step, hint);

  const advisories = findAdvisories(response);

  const unique = [...new Set(advisories.map(advisory => advisory.module))];

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));
  const patchCount = patches.length;

  if (patchCount === 0) return loader(verbose, spinner, 'warn', 'skipped patches', '', hint);

  patches.sort((a, b) => a.severity.localeCompare(b.severity));

  patches.forEach(patch => {
    auditAdvisory += `\n\n${patch.module}\npatched: ${
      patch.patched !== '<0.0.0'
        ? `${chalk.green('true')} ${chalk.gray(`${patch.version}`)}`
        : chalk.red('false')
    }\nvulnerability: ${colorSeverity(patch.severity)} ${chalk.gray(
      patch.title.toLowerCase()
    )}\n${chalk.grey.underline(patch.url)}`;
  });

  console.log(`${auditAdvisory}\n`);

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
