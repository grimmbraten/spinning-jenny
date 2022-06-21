const ora = require('ora');
const chalk = require('chalk');
const { read } = require('~services/json');
const { why, audit } = require('~services/yarn');
const { fail, succeed } = require('~services/ora');
const { prefix, colorSeverity, findAdvisories } = require('~helpers');

const handler = async (hint, target, config) => {
  let output = '';

  const step = prefix(config);
  const spinner = ora(step + 'analyzing vulnerabilities' + hint).start();

  const [success, response] = await audit(target);

  if (!success) return fail(spinner, step, hint, 'audit failed', response);

  const advisories = findAdvisories(response);
  const unique = [...new Set(advisories.map(advisory => advisory.module))];
  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));

  const parsedPatches = await why(patches, target);

  parsedPatches.sort((a, b) => a.order - b.order);
  parsedPatches.sort((a, b) => a.solved - b.solved);

  const dependencies = Object.keys(await read(target, 'package.json', 'dependencies'));
  const devDependencies = Object.keys(await read(target, 'package.json', 'devDependencies'));

  parsedPatches.forEach((patch, index) => {
    const why =
      patch.why.length > 0
        ? patch.why.pop().replace('Hoisted from ', '').replaceAll('"', '').split('#')
        : undefined;

    output += `\n${index > 0 ? '\n' : ''}${patch.module} @ ${patch.version} ${colorSeverity(
      patch.severity
    )}${
      why
        ? chalk.gray(` ${why.shift()} depends on it`)
        : devDependencies.includes(patch.module)
        ? `${chalk.gray(
            ` ${devDependencies.find(
              module => module === patch.module
            )} depends on it (devDependencies)`
          )}`
        : dependencies.includes(patch.module)
        ? `${chalk.gray(
            ` ${dependencies.find(module => module === patch.module)} depends on it (dependencies)`
          )}`
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
    )}`;
  });

  const total = parsedPatches.length;

  if (total !== 0) {
    const solved = parsedPatches.filter(patch => patch.patchedVersions !== '<0.0.0').length / total;
    const unsolved =
      parsedPatches.filter(patch => patch.patchedVersions === '<0.0.0').length / total;

    output += `\n\nof the modules found with potential security vulnerabilities\n${chalk.green(
      `${(solved * 100).toFixed(2)}%`
    )} can be solved with a resolution or module upgrade\n${chalk.red(
      `${(unsolved * 100).toFixed(2)}%`
    )} are currently unsolved, no patched versions available`;
  }

  return succeed(
    spinner,
    step,
    hint,
    `found ${total} potential security ${
      total > 1 ? 'vulnerabilities' : 'vulnerability'
    } in your dependencies`,
    output
  );
};

module.exports = {
  patches: handler
};
