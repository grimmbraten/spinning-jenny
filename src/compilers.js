const path = require("path");
const shell = require("shelljs");
const json = require("json-file-plus");
const {
  parseJson,
  resolutionCount,
  scannedDependencies,
  extractUpgradeOutcome
} = require("./helpers");

const dry = (spinner, hint, target) => {
  const name = path.join(target, "package.json");

  return new Promise(function (resolve, reject) {
    spinner.start("removing resolutions" + hint);

    json(name, async (err, file) => {
      if (err) return reject(new Error(err));

      const resolutions = await file.get("resolutions");

      if (!resolutions) {
        spinner.fail("package.json does not include any resolutions" + hint);
        return resolve();
      }

      await file.remove("resolutions");

      file
        .save()
        .then(() => {
          spinner.succeed(
            `removed ${resolutionCount(resolutions)} resolutions` + hint
          );
          resolve();
        })
        .catch(err => {
          spinner.fail("remove resolutions failed" + hint);
          reject(new Error(err));
        });
    });
  });
};

const test = (option, value) => shell.test(option, value);

const audit = (spinner, hint, target) => {
  spinner.start("scanning for vulnerabilities" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} audit --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          spinner.fail("scan failed" + hint);
          reject(new Error(stderr));
        }

        spinner.succeed(
          `scanned ${scannedDependencies(parseJson(stdout))} dependencies` +
            hint
        );
        return resolve(stdout);
      }
    );
  });
};

const upgrade = (spinner, hint, target) => {
  spinner.start("upgrading packages" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} upgrade --json`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          spinner.fail("upgrade failed" + hint);
          reject(new Error(stderr));
        }

        const outcome = extractUpgradeOutcome(parseJson(stdout));

        if (!outcome) {
          spinner.fail("upgrade failed");
          return resolve(stdout);
        }

        spinner.succeed(outcome + hint);
        return resolve(stdout);
      }
    );
  });
};

const install = (spinner, hint, target) => {
  spinner.start("install packages" + hint);

  return new Promise(function (resolve, reject) {
    shell.exec(
      `yarn --cwd ${target} install`,
      {
        silent: true
      },
      (_, stdout, stderr) => {
        if (stderr) {
          spinner.fail("installation failed" + hint);
          reject(new Error(stderr));
        }

        spinner.succeed("installed successfully" + hint);
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
