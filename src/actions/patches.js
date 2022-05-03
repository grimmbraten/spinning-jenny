const ora = require('ora');
const chalk = require('chalk');
const { execute } = require('../common');
const { prefix, colorSeverity, findAdvisories } = require('../helpers');

const patches = async (hint, target, config) => {
  let list = '';
  const step = prefix(config);
  const spinner = ora(step + 'analyzing vulnerabilities' + hint).start();

  const [success, response] = await execute(`yarn --cwd ${target} audit --json`);

  if (!success) {
    spinner.fail(step + `audit failed\n\n${response}` + hint);
    return 2;
  }

  const advisories = findAdvisories(response);
  const unique = [...new Set(advisories.map(advisory => advisory.module))];

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));
  patches.sort((a, b) => a.time - b.time);

  patches.forEach((patch, index) => {
    list += `\n${index > 0 ? '\n' : ''}${patch.module} @ ${patch.version} ${colorSeverity(
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
