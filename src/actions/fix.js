const ora = require('ora');
const { read, write } = require('../services/json');
const { shell } = require('../services/shelljs');
const chalk = require('chalk');
const {
  reduce,
  timely,
  randomHold,
  randomFact,
  randomEndgame,
  findAuditSummary,
  findAdvisories,
  prefix
} = require('../helpers');

const fix = async (hint, target, { upgrade, exclude, ...config }) => {
  const unsolved = [];
  const upgrades = [];
  const resolutions = {};
  const upgradeTimeouts = [];
  const installTimeouts = [];

  const step = prefix(config);
  const spinner = ora(step + 'auditing dependencies' + hint).start();

  const [success, response] = await shell(`yarn --cwd ${target} audit --json`);

  if (!success) {
    spinner.fail(step + 'audit failed' + hint);
    if (response[1]) console.log(chalk.red(`\n${response[1]}`));
    return 2;
  }

  spinner.text = step + 'analyzing vulnerabilities' + hint;

  const { data } = findAuditSummary(response);
  const vulnerabilities = reduce(data.vulnerabilities);

  if (vulnerabilities === 0) {
    spinner.succeed(step + 'all dependencies are secure' + hint);
    return 1;
  }

  const modules = await read(target, 'package.json', 'dependencies');
  const devModules = await read(target, 'package.json', 'devDependencies');
  const dependencies = Object.keys(modules).concat(Object.keys(devModules));

  const advisories = findAdvisories(response);
  const unique = [...new Set(advisories.map(advisory => advisory.module))];
  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));

  await Promise.all(
    patches.map(async advisory => {
      if (advisory.patchedVersions === '<0.0.0')
        unsolved.push(`${advisory.module}@${advisory.version}`);
      else if (
        upgrade &&
        !exclude.includes(advisory.module) &&
        dependencies.includes(advisory.module)
      ) {
        upgrades.push(
          `${advisory.module}@${advisory.patchedVersions
            .replace(/(>=|>)/g, '^')
            .replace(/(<|<=)/g, '')}`
        );

        const [success, response] = await shell(
          `yarn --cwd ${target} why ${advisory.module} --json`
        );

        if (!success) {
          spinner.fail(step + 'analyzation failed' + hint);
          if (response[1]) console.log(chalk.red(`\n${response[1]}`));
          return 2;
        }

        if (response.includes(`#${advisory.module}`))
          resolutions[advisory.module] = advisory.patchedVersions;
      } else if (!exclude.includes(advisory.module))
        resolutions[advisory.module] = advisory.patchedVersions;
    })
  );

  const total = unsolved.length + upgrades.length + Object.keys(resolutions).length;

  if (upgrades.length > 0 && upgrade) {
    spinner.text = step + 'upgrading dependencies' + hint;

    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomHold(), 1000));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 3500));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 7500));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 12500));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomEndgame(), 20000));

    const [success, response] = await shell(`yarn --cwd ${target} upgrade ${upgrades.join(' ')}`);

    upgradeTimeouts.forEach(timeout => clearTimeout(timeout));

    if (!success) {
      spinner.fail(step + 'upgrade failed' + hint);
      if (response[1]) console.log(chalk.red(`\n${response[1]}`));
      return 2;
    }
  }

  if (Object.keys(resolutions).length > 0) {
    await write(target, 'package.json', { resolutions });

    // eslint-disable-next-line require-atomic-updates
    spinner.text = step + 'installing dependencies' + hint;

    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomHold(), 2500));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 15000));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 30000));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 45000));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomEndgame(), 600000));

    const [success, response] = await shell(`yarn --cwd ${target} install`);

    installTimeouts.forEach(timeout => clearTimeout(timeout));

    if (!success) {
      spinner.fail(step + 'installation failed' + hint);
      if (response[1]) console.log(chalk.red(`\n${response[1]}`));
      return 2;
    }
  }

  if (unsolved.length > 0 && total === unsolved.length)
    spinner.fail(
      step +
        'failed to solve any of the potential security vulnerabilities in your dependencies' +
        hint
    );
  else if (unsolved.length === 0)
    spinner.succeed(
      step + 'solved all potential security vulnerabilities in your dependencies' + hint
    );
  else
    spinner.warn(
      step +
        `solved ${total - unsolved.length}/${total} potential security ${
          total - unsolved.length === 1 ? 'vulnerability' : 'vulnerabilities'
        } in your dependencies` +
        hint
    );

  return 0;
};

module.exports = {
  fix
};
