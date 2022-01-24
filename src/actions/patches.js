const ora = require('ora');
const chalk = require('chalk');
const { audit } = require('../common');
const { prefix, verbosely, colorSeverity, findAdvisories } = require('../helpers');

const patches = async (hint, target, { verbose, ...config }) => {
  let list = '';
  const step = prefix(config);
  const spinner = ora(step + 'analyzing vulnerabilities' + hint).start();

  const [success, response] = await audit(target);

  if (!success) {
    spinner.fail(step + 'scan failed' + hint);
    verbosely('fail reason', response, 'last');
    return 2;
  }

  const advisories = findAdvisories(response);
  if (verbose) verbosely('advisory count', advisories.length);

  const unique = [...new Set(advisories.map(advisory => advisory.module))];
  if (verbose) verbosely('advisory count (unique)', unique.length);

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));
  patches.sort((a, b) => a.time - b.time);

  patches.forEach((patch, index) => {
    list += `\n${index > 0 && '\n'}${patch.module} @ ${patch.version} ${colorSeverity(
      patch.severity
    )}\n${
      patch.recommendation !== 'none' ? patch.recommendation : 'could not find any recommendation'
    } ${
      patch.patchedVersions !== '<0.0.0' ? `${chalk.green('(patched)')}` : chalk.red('(unsolved)')
    }\n${patch.references}\n${chalk.gray(
      `${patch.foundBy ? `${patch.foundBy} @ ` : ''}${patch.updated || patch.created}`
    )}`;
  });

  spinner.succeed(
    step + `found ${patches.length} ${patches.length === 1 ? 'advisory' : 'advisories'}` + hint
  );

  console.log(list);

  return 0;
};

module.exports = {
  patches
};
