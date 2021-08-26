const shell = require('shelljs');

const {
  read,
  write,
  remove,
  loader,
  parseJson,
  stepLabel,
  colorError,
  resolutionCount,
  scannedDependencies,
  extractUpgradeOutcome
} = require('./helpers');

const backupDir = __dirname;
const backupFile = '.backups.json';

const test = (option, value) => shell.test(option, value);

const clean = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    loader(verbose, spinner, 'start', 'cleaning up old resolutions', step, hint);

    const resolutions = await read(target, 'package.json', 'resolutions');

    if (!resolutions)
      loader(verbose, spinner, 'warn', 'failed to remove pre-existing resolution', step, hint);
    else {
      const success = await remove(target, 'package.json', 'resolutions');

      if (success)
        loader(
          verbose,
          spinner,
          'succeed',
          `cleaned up ${resolutionCount(resolutions)} resolution${
            resolutionCount(resolutions) > 1 ? 's' : ''
          }`,
          step,
          hint
        );
      else return reject();
    }

    resolve();
  }).catch(err => {
    loader(verbose, spinner, 'fail', 'failed to remove resolutions', step, hint);
    console.log(`\n${colorError(err)}`);
  });
};

const scan = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  return new Promise((resolve, reject) => {
    loader(verbose, spinner, 'start', 'scanning package.json', step, hint);

    shell.exec(
      `yarn --cwd ${target} audit --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) return reject(stderr);

        loader(
          verbose,
          spinner,
          'succeed',
          `scanned ${scannedDependencies(parseJson(stdout))} dependencies`,
          step,
          hint
        );

        resolve(stdout);
      }
    );
  }).catch(err => {
    loader(verbose, spinner, 'fail', 'failed to scan package.json', step, hint);
    console.log(`\n${colorError(err)}`);
  });
};

const upgrade = (spinner, hint, target, { verbose, pattern, ...config }) => {
  const step = stepLabel(config);

  return new Promise((resolve, reject) => {
    loader(verbose, spinner, 'start', 'upgrading packages', step, hint);

    shell.exec(
      `yarn --cwd ${target} upgrade ${pattern} --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) return reject(stderr);

        const outcome = extractUpgradeOutcome(parseJson(stdout));

        if (!outcome) return reject();

        loader(verbose, spinner, 'succeed', outcome, step, hint);
        resolve(stdout);
      }
    );
  }).catch(err => {
    loader(verbose, spinner, 'fail', 'failed to upgrade packages', step, hint);
    console.log(`\n${colorError(err)}`);
  });
};

const install = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  return new Promise((resolve, reject) => {
    loader(verbose, spinner, 'start', 'installing packages', step, hint);

    shell.exec(
      `yarn --cwd ${target} install`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) return reject(stderr);

        loader(verbose, spinner, 'succeed', 'successfully installed packages', step, hint);

        resolve(stdout);
      }
    );
  }).catch(err => {
    loader(verbose, spinner, 'fail', 'failed to installed packages', step, hint);
    console.log(`\n${colorError(err)}`);
  });
};

const backup = async (spinner, hint, target, { verbose, ...config }) => {
  const backup = {};
  const step = stepLabel(config);

  loader(verbose, spinner, 'start', 'searching for pre-existing resolutions', step, hint);

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions)
    return loader(verbose, spinner, 'info', 'no pre-existing resolutions found', step, hint);

  const project = target.split('/').pop();
  backup[project] = { resolutions, date: new Date().toString() };
  await write(backupDir, backupFile, backup);

  loader(verbose, spinner, 'succeed', 'successfully backed up resolutions', step, hint);
};

const restore = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);
  loader(verbose, spinner, 'start', 'restoring resolutions', step, hint);

  const project = target.split('/').pop();
  const { resolutions } = await read(backupDir, backupFile, project);

  if (!resolutions)
    return loader(verbose, spinner, 'fail', 'failed to restore resolutions', step, hint);

  await write(target, 'package.json', { resolutions });

  loader(verbose, spinner, 'succeed', 'successfully restored resolutions', step, hint);
};

module.exports = {
  test,
  scan,
  clean,
  backup,
  restore,
  install,
  upgrade
};
