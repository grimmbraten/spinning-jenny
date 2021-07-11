const path = require("path");
const shell = require("shelljs");
const package = require("json-file-plus");
const { parseJson } = require("./helpers");

const resolve = (spinner, target, cleanup, install) => {
  const name = path.join(target, "package.json");

  if (!cleanup) audit(spinner, target, name, cleanup, install);
  else {
    package(name, async (err, file) => {
      if (err) return console.error(err);

      const count = await file.get("resolutions");

      spinner.text = `removing ${Object.keys(count).length} resolutions`;

      await file.set({ resolutions: [] });
      await file.save();

      audit(spinner, target, name, cleanup, install);
    });
  }
};

const audit = (spinner, target, name, cleanup, install) => {
  shell.exec(
    `yarn --cwd ${target} audit --json`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner, target, name, cleanup, install)
  );
};

const callback = (response, spinner, target, name, cleanup, install) => {
  package(name, async (err, file) => {
    if (err) return console.error(err);

    const json = parseJson(response);

    const { data } = json.filter(data => data.type === "auditSummary")[0];

    const vulnerabilities = Object.values(data.vulnerabilities).reduce(
      (a, b) => a + b
    );

    if (vulnerabilities.length === 0)
      return spinner.fail("no vulnerabilities found");

    const resolutions = json
      .map(({ data, type }) => {
        if (type === "auditAdvisory")
          return {
            title: data.advisory.title,
            module: data.advisory.module_name,
            version: data.advisory.vulnerable_versions,
            patched: data.advisory.patched_versions,
            severity: data.advisory.severity,
            url: data.advisory.url
          };
      })
      .filter(data => data)
      .filter(({ patched }) => patched !== "<0.0.0");

    spinner.text = `adding ${resolutions.length} resolutions`;

    if (resolutions.length === 0) return spinner.fail("no resolutions found");

    const old = await file.get("resolutions");

    let fixes = {};

    resolutions.forEach(({ module, patched }) => {
      fixes[module] = patched;
    });

    if (Object.keys(fixes).length > 0) {
      await file.set({ resolutions: fixes });
      await file.save();

      if (install) {
        spinner.start("installing packages");
        await shell.exec(
          `yarn --cwd ${target} install`,
          {
            silent: true
          },
          () => spinner.succeed("installed packages")
        );
      } else spinner.succeed(`completed successfully`);
    } else {
      if (cleanup) {
        await file.set({ resolutions: old });
        await file.save();
      }

      spinner.fail("no vulnerabilities found");
    }
  });
};

module.exports = { resolve };
