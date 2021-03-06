const ora = require('ora');
const chalk = require('chalk');
const { read } = require('../services/json');
const { why, audit } = require('../services/yarn');
const { fail, succeed } = require('../services/ora');
const {
  prefix,
  timely,
  checkpoints,
  colorSeverity,
  emojiSeverity,
  getPercentageEmoji,
  parseAdvisories
} = require('../helpers');

const handler = async (hint, target, config) => {
  let output = '';
  const timeouts = [];

  const step = prefix(config);
  const spinner = ora(step + 'analyzing vulnerabilities' + hint).start();

  checkpoints.forEach(({ time, content }) =>
    timeouts.push(timely(spinner, step, 'analyzing vulnerabilities', content, time))
  );

  const [success, response] = await audit(target);

  timeouts.forEach(timeout => clearTimeout(timeout));

  if (!success) return fail(spinner, step, hint, 'audit failed', response);

  const advisories = parseAdvisories(response);
  const unique = [...new Set(advisories.map(advisory => advisory.module))];
  const advise = unique.map(module => advisories.find(advisory => advisory.module === module));

  const parsedAdvise = await why(advise, target);

  parsedAdvise.sort((a, b) => a.order - b.order);
  parsedAdvise.sort((a, b) => a.solved - b.solved);

  const dependencies = Object.keys(await read(target, 'package.json', 'dependencies'));
  const devDependencies = Object.keys(await read(target, 'package.json', 'devDependencies'));

  parsedAdvise.forEach((patch, index) => {
    const why =
      patch.why.length > 0
        ? patch.why.pop().replace('Hoisted from ', '').replaceAll('"', '').split('#')
        : undefined;

    output += `\n${index > 0 ? '\n' : ''}${emojiSeverity(patch.severity)} ${patch.module} @ ${
      patch.version
    } ${colorSeverity(patch.severity)}${
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
        ? `   ${patch.recommendation}`
        : '   no recommendation available at this time'
    } ${
      patch.patchedVersions !== '<0.0.0' ? `${chalk.green('(solved)')}` : chalk.red('(unsolved)')
    }\n${chalk.gray(
      patch.references
        .find(reference => reference.includes('https://nvd.nist.gov/vuln/detail/'))
        .replace('-', '- ')
    )}\n${chalk.gray(
      patch.references
        .find(reference => reference.includes('https://github.com/advisories'))
        .replace('-', '- ')
    )}`;
  });

  const total = parsedAdvise.length;

  if (total !== 0) {
    const solved = parsedAdvise.filter(patch => patch.patchedVersions !== '<0.0.0').length / total;
    const unsolved =
      parsedAdvise.filter(patch => patch.patchedVersions === '<0.0.0').length / total;

    const solvedPercentage = solved * 100;
    const unsolvedPercentage = unsolved * 100;

    output += `\n\n${getPercentageEmoji(
      solvedPercentage
    )} out of the modules found with potential security vulnerabilities\n   ${chalk.green(
      `${solvedPercentage.toFixed(2)}%`
    )} can be solved with a resolution or module upgrade\n   ${chalk.red(
      `${unsolvedPercentage.toFixed(2)}%`
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
  advise: handler
};
