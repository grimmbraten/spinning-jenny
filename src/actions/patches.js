const ora = require('ora');
const chalk = require('chalk');
const { read } = require('../services/json');
const { shell } = require('../services/shelljs');
const { prefix, colorSeverity, findAdvisories } = require('../helpers');
const { why } = require('../services/yarn');

const patches = async (hint, target, config) => {
  let output = '';

  const step = prefix(config);
  const spinner = ora(step + 'analyzing vulnerabilities' + hint).start();

  const modules = Object.keys(await read(target, 'package.json', 'dependencies'));
  const devModules = Object.keys(await read(target, 'package.json', 'devDependencies'));

  const [success, response] = await shell(`yarn --cwd ${target} audit --json`);

  if (!success) {
    spinner.fail(step + `audit failed\n\n${response}` + hint);
    return 2;
  }

  const advisories = findAdvisories(response);
  const unique = [...new Set(advisories.map(advisory => advisory.module))];

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));

  const parsedPatches = await why(patches, target);

  parsedPatches.sort((a, b) => a.order - b.order);
  parsedPatches.sort((a, b) => a.solved - b.solved);

  parsedPatches.forEach((patch, index) => {
    const why =
      patch.why.length > 0
        ? patch.why.pop().replace('Hoisted from ', '').replaceAll('"', '').split('#')
        : undefined;

    output += `\n${index > 0 ? '\n' : ''}${patch.module} @ ${patch.version} ${colorSeverity(
      patch.severity
    )}${
      why
        ? chalk.gray(` ${why.shift()} depends on ${why.pop(', ')}`)
        : devModules.includes(patch.module)
        ? `${chalk.gray(' package.json (devDependencies)')}`
        : modules.includes(patch.module)
        ? `${chalk.gray(' package.json (dependencies)')}`
        : ''
    }\n${
      patch.recommendation !== 'none'
        ? patch.recommendation
        : 'no recommendation available at this time'
    } ${
      patch.patchedVersions !== '<0.0.0' ? `${chalk.green('(solved)')}` : chalk.red('(unsolved)')
    }\n${chalk.gray(
      patch.references.find(reference => reference.includes('https://nvd.nist.gov/vuln/detail/'))
    )}\n${chalk.gray(
      patch.references.find(reference => reference.includes('https://github.com/advisories'))
    )}\n${chalk.gray(
      `${patch.foundBy ? `${patch.foundBy} @ ` : ''}${patch.updated || patch.created}`
    )}`;
  });

  spinner.succeed(
    step +
      `found ${patches.length} ${
        patches.length === 1 ? 'advisory' : 'advisories'
      } with potential security vulnerabilities in your dependencies` +
      hint
  );

  console.log(output);

  return 0;
};

module.exports = {
  patches
};
