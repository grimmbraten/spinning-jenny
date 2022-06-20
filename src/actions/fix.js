const ora = require('ora');
const { read, write } = require('~services/json');
const { fail, warn, succeed } = require('~services/ora');
const { add, audit, install } = require('~services/yarn');
const {
  reduce,
  timely,
  checkpoints,
  findAuditSummary,
  findAdvisories,
  prefix
} = require('~helpers');

const handler = async (hint, target, { upgrade, exclude, ...config }) => {
  const unsolved = [];
  const resolutions = {};
  const dependenciesToAdd = [];
  const devDependenciesToAdd = [];

  const timeouts = [];

  const step = prefix(config);
  const spinner = ora(step + 'auditing dependencies' + hint).start();

  const [success, response] = await audit(target);
  if (!success) return fail(spinner, step, hint, 'audit failed', response);

  spinner.text = step + 'analyzing vulnerabilities' + hint;

  const { data } = findAuditSummary(response);
  const vulnerabilities = reduce(data.vulnerabilities);

  if (vulnerabilities === 0)
    return warn(
      spinner,
      step,
      hint,
      'found no potential security vulnerabilities in your dependencies'
    );

  const dependencies = Object.keys(await read(target, 'package.json', 'dependencies'));
  const devDependencies = Object.keys(await read(target, 'package.json', 'devDependencies'));
  const allDependencies = dependencies.concat(devDependencies);

  const advisories = findAdvisories(response);
  const unique = [...new Set(advisories.map(advisory => advisory.module))];
  const patches = unique.map(module => advisories.find(advisory => advisory.module === module));

  await Promise.all(
    patches.map(advisory => {
      if (advisory.patchedVersions === '<0.0.0')
        unsolved.push(`${advisory.module}@${advisory.version}`);
      else if (
        upgrade &&
        !exclude.includes(advisory.module) &&
        allDependencies.includes(advisory.module)
      ) {
        const moduleVersion = `${advisory.module}@${advisory.patchedVersions.replace(
          />=|>|<|<=/g,
          ''
        )}`;

        if (dependencies.includes(advisory.module)) dependenciesToAdd.push(moduleVersion);
        else devDependencies.push(moduleVersion);
      } else if (!exclude.includes(advisory.module))
        resolutions[advisory.module] = advisory.patchedVersions;
    })
  );

  const total =
    unsolved.length +
    dependenciesToAdd.length +
    devDependenciesToAdd.length +
    Object.keys(resolutions).length;

  if (dependenciesToAdd.length > 0) {
    spinner.text = step + 'upgrading dependencies' + hint;

    checkpoints.forEach(({ time, content }) =>
      timeouts.push(timely(spinner, step, 'upgrading dependencies', content, time))
    );

    const [success, response] = await add(target, dependenciesToAdd);

    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts.splice(0, timeouts.length);

    if (!success) return fail(spinner, step, hint, 'upgrade failed', response);
  }

  if (devDependenciesToAdd.length > 0) {
    spinner.text = step + 'upgrading development dependencies' + hint;

    checkpoints.forEach(({ time, content }) =>
      timeouts.push(timely(spinner, step, 'upgrading dependencies', content, time))
    );

    const [success, response] = await add(target, devDependenciesToAdd, true);

    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts.splice(0, timeouts.length);

    if (!success) return fail(spinner, step, hint, 'upgrade failed', response);
  }

  if (Object.keys(resolutions).length > 0) {
    await write(target, 'package.json', { resolutions });

    spinner.text = step + 'installing dependencies' + hint;

    checkpoints.forEach(({ time, content }) =>
      timeouts.push(timely(spinner, step, 'installing dependencies', content, time))
    );

    const [success, response] = await install(target);

    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts.splice(0, timeouts.length);

    if (!success) return fail(spinner, step, hint, 'installation failed', response);
  }

  if (unsolved.length > 0 && total === unsolved.length)
    return fail(
      spinner,
      step,
      hint,
      'failed to solve any of the potential security vulnerabilities in your dependencies'
    );
  else if (unsolved.length === 0)
    return succeed(
      spinner,
      step,
      hint,
      'solved all potential security vulnerabilities in your dependencies'
    );
  else
    return warn(
      spinner,
      step,
      hint,
      `solved ${total - unsolved.length}/${total} potential security ${
        total - unsolved.length === 1 ? 'vulnerability' : 'vulnerabilities'
      } in your dependencies`
    );
};

module.exports = {
  fix: handler
};
