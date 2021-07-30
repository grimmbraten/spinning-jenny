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

const dry = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    loader(verbose, spinner, 'start', 'removing resolutions', step, hint);

    const resolutions = await read(target, 'package.json', 'resolutions');

    if (!resolutions) {
      loader(verbose, spinner, 'warn', 'could not find any resolutions to remove', step, hint);
    } else {
      const success = await remove(target, 'package.json', 'resolutions');

      if (success) {
        loader(
          verbose,
          spinner,
          'succeed',
          `removed ${resolutionCount(resolutions)} resolution(s)`,
          step,
          hint
        );
      } else return reject();
    }

    resolve();
  }).catch(err => {
    loader(verbose, spinner, 'fail', 'failed to remove resolutions', step, hint);
    console.log(`\n${colorError(err)}`);
  });
};

const audit = (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);

  return new Promise((resolve, reject) => {
    loader(verbose, spinner, 'start', 'scanning for vulnerabilities', step, hint);

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
    loader(verbose, spinner, 'fail', 'failed to scan for vulnerabilities', step, hint);
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

  loader(verbose, spinner, 'start', 'scanning for existing resolutions', step, hint);

  const resolutions = await read(target, 'package.json', 'resolutions');

  if (!resolutions)
    return loader(verbose, spinner, 'info', 'could not find any resolutions to backup', step, hint);

  const project = target.split('/').pop();
  backup[project] = { resolutions, date: new Date().toString() };
  await write(backupDir, backupFile, backup);

  loader(verbose, spinner, 'succeed', 'successfully created backup of resolutions', step, hint);
};

const original = async (spinner, hint, target, { verbose, ...config }) => {
  const step = stepLabel(config);
  loader(verbose, spinner, 'start', 'applying original resolutions', step, hint);

  const project = target.split('/').pop();
  const { resolutions } = await read(backupDir, backupFile, project);

  if (!resolutions)
    return loader(verbose, spinner, 'fail', 'failed to apply original resolutions', step, hint);

  await write(target, 'package.json', { resolutions });

  loader(verbose, spinner, 'succeed', 'successfully applied original resolutions', step, hint);
};

module.exports = {
  dry,
  test,
  audit,
  backup,
  install,
  upgrade,
  original
};
