/* eslint-disable no-extra-parens */

const chalk = require('chalk');

const { read, write, audit, execute } = require('../common');
const { reduce, loader, findAuditSummary, findAdvisories, prefix } = require('../helpers');

const fix = async (spinner, hint, target, { verbose, ...config }) => {
  const unsolved = [];
  const upgrades = [];
  const resolutions = {};

  const step = prefix(config);

  const [success, response] = await audit(spinner, hint, target, verbose, step);
  if (!success) return loader(spinner, 'fail', 'scan failed', step, hint);

  const { data } = findAuditSummary(response);
  const vulnerabilities = reduce(data.vulnerabilities);

  if (vulnerabilities === 0)
    return loader(
      spinner,
      'succeed',
      'no vulnerabilities found, dependencies are secure',
      '',
      hint
    );

  const modules = await read(target, 'package.json', 'dependencies');
  const devModules = await read(target, 'package.json', 'devDependencies');
  const dependencies = Object.keys(modules).concat(Object.keys(devModules));

  verbose && console.log('\n\nloaded in package.json dependencies\n', dependencies);

  loader(spinner, 'text', 'analyzing advisories', step, hint);

  const advisories = findAdvisories(response);

  verbose && console.log('\ntotal count of found advisories', advisories.length);

  const unique = [...new Set(advisories.map(advisory => advisory.module))];

  verbose && console.log('\ntotal count of unique advisories', unique.length);

  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));

  verbose && console.log('\nextracted patches from yarn audit\n', patches);

  patches.forEach(advisory => {
    if (advisory.patchedVersions === '<0.0.0')
      unsolved.push(`${advisory.module}@${advisory.version}`);
    else if (dependencies.includes(advisory.module))
      upgrades.push(`${advisory.module}@${advisory.patchedVersions.replace(/(>|<|=)/g, '')}`);
    else resolutions[advisory.module] = advisory.patchedVersions;
  });

  const total = unsolved.length + upgrades.length + Object.keys(resolutions).length;

  verbose && console.log('\nresolutions to add', Object.keys(resolutions).length);
  verbose && console.log('\nmodules to upgrade', upgrades.length);
  verbose && console.log('\nunsolved vulnerabilities', unsolved.length), console.log();

  if (upgrades.length > 0) {
    loader(spinner, 'text', 'upgrading dependencies', step, hint);
    const [success, response] = await execute(`yarn --cwd ${target} upgrade ${upgrades.join(' ')}`);
    if (!success) console.log(`yarn upgrade failed`, response);
  }

  if (Object.keys(resolutions).length > 0) {
    loader(spinner, 'text', 'applying resolutions', step, hint);
    await write(target, 'package.json', { resolutions });

    loader(spinner, 'text', 'installing with new resolutions', step, hint);
    const [success] = await execute(`yarn --cwd ${target} install`);
    if (!success) console.log(`yarn install failed`);
  }

  loader(
    spinner,
    unsolved.length > 0 && total === unsolved.length
      ? 'fail'
      : unsolved.length === 0
      ? 'succeed'
      : 'warn',
    unsolved.length > 0 && total === unsolved.length
      ? `could not fix known ${unsolved.length === 1 ? 'vulnerability' : 'vulnerabilities'}`
      : unsolved.length === 0
      ? 'fixed known vulnerabilities without any issues'
      : `fixed known vulnerabilities but encountered ${
          unsolved.length === 1 ? 'an ' : ''
        }unsolved ${unsolved.length === 1 ? 'vulnerability' : 'vulnerabilities'}`,
    step,
    hint
  );

  !verbose &&
    console.log(
      `${
        Object.keys(resolutions).length > 0
          ? chalk.green(
              `\n➜ applied ${Object.keys(resolutions).length} module resolution${
                Object.keys(resolutions).length === 1 ? '' : 's'
              } (${Math.round((Object.keys(resolutions).length / total) * 100 * 10) / 10}%)`
            )
          : ''
      }${
        upgrades.length > 0
          ? chalk.yellow(
              `\n⇡ upgraded ${upgrades.length} project ${
                upgrades.length === 1 ? 'dependency' : 'dependencies'
              } (${Math.round((upgrades.length / total) * 100 * 10) / 10}%)`
            )
          : ''
      }${
        unsolved.length > 0
          ? chalk.red(
              `\n✘ skipped ${unsolved.length} unsolved ${
                unsolved.length === 1 ? 'vulnerability' : 'vulnerabilities'
              } (${Math.round((unsolved.length / total) * 100 * 10) / 10}%)`
            )
          : ''
      }`
    );
};

module.exports = {
  fix
};
