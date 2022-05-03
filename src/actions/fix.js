const ora = require('ora');
const { read, write, execute } = require('../common');
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

const fix = async (hint, target, { upgrade, ...config }) => {
  const unsolved = [];
  const upgrades = [];
  const resolutions = {};
  const upgradeTimeouts = [];
  const installTimeouts = [];

  const step = prefix(config);
  const spinner = ora(step + 'auditing dependencies' + hint).start();

  const [success, response] = await execute(`yarn --cwd ${target} audit --json`);

  if (!success) {
    spinner.fail(step + response + hint);
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

  const promises = patches.map(async advisory => {
    if (advisory.patchedVersions === '<0.0.0')
      unsolved.push(`${advisory.module}@${advisory.version}`);
    else if (dependencies.includes(advisory.module)) {
      upgrades.push(
        `${advisory.module}@${advisory.patchedVersions
          .replace(/(>=|>)/g, '^')
          .replace(/(<|<=)/g, '')}`
      );

      const [success, response] = await execute(
        `yarn --cwd ${target} why ${advisory.module} --json`
      );

      if (!success) {
        spinner.fail(step + `analyzing failed\n\n${response}` + hint);
        return 2;
      }

      if (response.includes(`#${advisory.module}`))
        resolutions[advisory.module] = advisory.patchedVersions;
    } else resolutions[advisory.module] = advisory.patchedVersions;
  });

  await Promise.all(promises);

  const total = unsolved.length + upgrades.length + Object.keys(resolutions).length;

  if (upgrades.length > 0 && upgrade) {
    spinner.text = step + 'upgrading dependencies' + hint;

    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomHold(), 5000));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 30000));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 60000));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomFact(), 90000));
    upgradeTimeouts.push(timely(spinner, step, 'upgrading dependencies', randomEndgame(), 1200000));

    const [success, response] = await execute(`yarn --cwd ${target} upgrade ${upgrades.join(' ')}`);

    upgradeTimeouts.forEach(timeout => clearTimeout(timeout));

    if (!success) {
      spinner.fail(step + `upgrade failed\n\n${response}` + hint);
      return 2;
    }
  }

  if (Object.keys(resolutions).length > 0) {
    await write(target, 'package.json', { resolutions });

    // eslint-disable-next-line require-atomic-updates
    spinner.text = step + 'installing dependencies' + hint;

    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomHold(), 5000));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 30000));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 60000));
    installTimeouts.push(timely(spinner, step, 'installing dependencies', randomFact(), 90000));
    installTimeouts.push(
      timely(spinner, step, 'installing dependencies', randomEndgame(), 1200000)
    );

    const [success, response] = await execute(`yarn --cwd ${target} install`);

    installTimeouts.forEach(timeout => clearTimeout(timeout));

    if (!success) {
      spinner.fail(step + `install failed\n\n${response}` + hint);
      return 2;
    }
  }

  if (unsolved.length > 0 && total === unsolved.length)
    spinner.fail(step + 'secured none of the known vulnerabilities' + hint);
  else if (unsolved.length === 0)
    spinner.succeed(step + 'secured all known vulnerabilities' + hint);
  else
    spinner.warn(
      step +
        `secured ${total - unsolved.length} ${
          total - unsolved.length === 1 ? 'known vulnerability' : 'of the known vulnerabilities'
        }` +
        hint
    );

  return 0;
};

module.exports = {
  fix
};
