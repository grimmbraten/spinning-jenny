require("colors");
const shell = require("shelljs");

const {
  read,
  write,
  remove,
  parseJson,
  resolutionCount,
  scannedDependencies,
  extractUpgradeOutcome
} = require("./helpers");

const dry = (spinner, hint, target, { label, verbose, ...config }) =>
  new Promise(async function (resolve, reject) {
    const step = config.getSteps();
    label && config.steps.completed++;

    verbose && spinner.start(step + "removing resolutions" + hint);

    const resolutions = await read(target, "package.json", "resolutions");

    if (!resolutions) {
      verbose &&
        spinner.fail(
          step + "package.json does not include any resolutions" + hint
        );
      return resolve();
    }

    const success = await remove(target, "package.json", "resolutions");

    if (success) {
      verbose &&
        spinner.succeed(
          step + `removed ${resolutionCount(resolutions)} resolutions` + hint
        );
      resolve();
    } else {
      verbose && spinner.fail(step + "remove resolutions failed" + hint);
      reject();
    }
  });

const test = (option, value) => shell.test(option, value);

const audit = (spinner, hint, target, { label, verbose, ...config }) => {
  const step = config.getSteps();
  label && config.steps.completed++;

  verbose && spinner.start(step + "scanning for vulnerabilities" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} audit --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          verbose && spinner.fail(step + "scan failed" + hint);
          reject(stderr);
        }

        verbose &&
          spinner.succeed(
            step +
              `scanned ${scannedDependencies(parseJson(stdout))} dependencies` +
              hint
          );
        return resolve(stdout);
      }
    );
  });
};

const upgrade = (
  spinner,
  hint,
  target,
  { label, verbose, pattern, ...config }
) => {
  const step = config.getSteps();
  label && config.steps.completed++;

  verbose && spinner.start(step + "upgrading packages" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} upgrade ${pattern} --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          verbose && spinner.fail(step + "upgrade failed" + hint);
          reject(stderr);
        }

        const outcome = extractUpgradeOutcome(parseJson(stdout));

        if (!outcome) {
          verbose && spinner.fail(step + "upgrade failed");
          return resolve(stdout);
        }

        verbose && spinner.succeed(step + outcome + hint);
        return resolve(stdout);
      }
    );
  });
};

const install = (spinner, hint, target, { label, verbose, ...config }) => {
  const step = config.getSteps();
  label && config.steps.completed++;

  verbose && spinner.start(step + "install packages" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} install`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          verbose && spinner.fail(step + "installation failed" + hint);
          reject(stderr);
        }

        verbose && spinner.succeed(step + "installed successfully" + hint);
        return resolve(stdout);
      }
    );
  });
};

const backup = async (spinner, hint, target, { verbose }) => {
  let backup = {};

  const resolutions = await read(target, "package.json", "resolutions");
  if (!resolutions) return;

  verbose && spinner.start("backing up resolutions" + hint);

  const dir = target.split("/").pop();

  backup[dir] = resolutions;

  await write("./src", ".backups.json", backup);

  verbose && spinner.succeed("created backup of resolutions" + hint);
};

const revert = async (spinner, hint, target, { verbose }) => {
  verbose && spinner.start("reverting resolutions" + hint);

  const dir = target.split("/").pop();

  const backup = await read("./src", ".backups.json", dir);

  await write(target, "package.json", { resolutions: backup });

  verbose && spinner.succeed("reverted resolutions" + hint);

  resolve();
};

module.exports = {
  dry,
  test,
  audit,
  backup,
  revert,
  upgrade,
  install
};
