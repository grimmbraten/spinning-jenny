const path = require("path");
const shell = require("shelljs");
const json = require("json-file-plus");
const {
  parseJson,
  resolutionCount,
  scannedDependencies,
  extractUpgradeOutcome
} = require("./helpers");

const dry = (spinner, hint, target, { verbose }) => {
  const name = path.join(target, "package.json");

  return new Promise(function (resolve, reject) {
    verbose && spinner.start("removing resolutions" + hint);

    json(name, async (err, file) => {
      if (err) return reject();

      const resolutions = await file.get("resolutions");

      if (!resolutions) {
        verbose &&
          spinner.fail("package.json does not include any resolutions" + hint);
        return resolve();
      }

      await file.remove("resolutions");

      file
        .save()
        .then(() => {
          verbose &&
            spinner.succeed(
              `removed ${resolutionCount(resolutions)} resolutions` + hint
            );
          resolve();
        })
        .catch(err => {
          verbose && spinner.fail("remove resolutions failed" + hint);
          reject();
        });
    });
  });
};

const test = (option, value) => shell.test(option, value);

const audit = (spinner, hint, target, { verbose }) => {
  verbose && spinner.start("scanning for vulnerabilities" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} audit --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          verbose && spinner.fail("scan failed" + hint);
          reject();
        }

        verbose &&
          spinner.succeed(
            `scanned ${scannedDependencies(parseJson(stdout))} dependencies` +
              hint
          );
        return resolve(stdout);
      }
    );
  });
};

const upgrade = (spinner, hint, target, { verbose, pattern }) => {
  verbose && spinner.start("upgrading packages" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} upgrade ${pattern} --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          verbose && spinner.fail("upgrade failed" + hint);
          reject();
        }

        const outcome = extractUpgradeOutcome(parseJson(stdout));

        if (!outcome) {
          verbose && spinner.fail("upgrade failed");
          return resolve(stdout);
        }

        verbose && spinner.succeed(outcome + hint);
        return resolve(stdout);
      }
    );
  });
};

const install = (spinner, hint, target, { verbose }) => {
  verbose && spinner.start("install packages" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} install`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          verbose && spinner.fail("installation failed" + hint);
          reject();
        }

        verbose && spinner.succeed("installed successfully" + hint);
        return resolve(stdout);
      }
    );
  });
};

module.exports = {
  dry,
  test,
  audit,
  upgrade,
  install
};
