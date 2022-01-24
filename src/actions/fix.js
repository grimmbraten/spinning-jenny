const ora = require('ora');
const { read, write, audit, execute } = require('../common');
const { reduce, findAuditSummary, findAdvisories, prefix, verbosely } = require('../helpers');

const fix = async (hint, target, { verbose, ...config }) => {
  const unsolved = [];
  const upgrades = [];
  const resolutions = {};

  const step = prefix(config);
  const spinner = ora(step + 'auditing dependencies' + hint).start();

  const [success, response] = await audit(target);
  if (!success) {
    spinner.fail(step + 'fix failed' + hint);
    if (verbose) verbosely('fail reason', response, 'last');
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

  if (verbose) verbosely('loaded in package.json dependencies', dependencies);

  const advisories = findAdvisories(response);
  if (verbose) verbosely('advisory count', advisories.length);

  const unique = [...new Set(advisories.map(advisory => advisory.module))];
  if (verbose) verbosely('advisory count (unique)', unique.length);

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));

  if (verbose) verbosely('patches (raw)', patches);

  patches.forEach(advisory => {
    if (advisory.patchedVersions === '<0.0.0')
      unsolved.push(`${advisory.module}@${advisory.version}`);
    else if (dependencies.includes(advisory.module))
      upgrades.push(`${advisory.module}@${advisory.patchedVersions.replace(/(>|<|=)/g, '')}`);
    else resolutions[advisory.module] = advisory.patchedVersions;
  });

  const total = unsolved.length + upgrades.length + Object.keys(resolutions).length;

  if (verbose) verbosely('resolution count', Object.keys(resolutions).length);
  if (verbose) verbosely('upgrade count', upgrades.length);
  if (verbose) verbosely('unsolved count', unsolved.length);

  if (upgrades.length > 0) {
    spinner.text = step + 'upgrading dependencies' + hint;
    const [success, response] = await execute(`yarn --cwd ${target} upgrade ${upgrades.join(' ')}`);
    if (!success) {
      spinner.fail(step + 'upgrade failed' + hint);
      if (verbose) verbosely('fail reason', response, 'last');
    }
    return 2;
  }

  if (Object.keys(resolutions).length > 0) {
    spinner.text = step + 'applying resolutions' + hint;
    await write(target, 'package.json', { resolutions });

    spinner.text = step + 'installing with new resolutions' + hint;
    const [success, response] = await execute(`yarn --cwd ${target} install`);
    if (!success) {
      spinner.fail(step + 'install failed' + hint);
      if (verbose) verbosely('fail reason', response, 'last');
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

  if (verbose) {
    console.log(
      `applied resolution${Object.keys(resolutions).length === 1 ? '' : 's'}`,
      // eslint-disable-next-line no-extra-parens
      `(${Math.round((Object.keys(resolutions).length / total) * 100 * 10) / 10}%)`
    );

    console.log(
      `upgraded ${upgrades.length === 1 ? 'dependency' : 'dependencies'}`,
      // eslint-disable-next-line no-extra-parens
      `(${Math.round((upgrades.length / total) * 100 * 10) / 10}%)`
    );

    console.log(
      `unsolved ${unsolved.length === 1 ? 'vulnerability' : 'vulnerabilities'}`,
      // eslint-disable-next-line no-extra-parens
      `(${Math.round((unsolved.length / total) * 100 * 10) / 10}%)\n`
    );
  }

  return 0;
};

module.exports = {
  fix
};
