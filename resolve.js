const path = require("path");
const shell = require("shelljs");
const package = require("json-file-plus");
const { parseJson } = require("./helpers");

const resolve = (spinner, target, cleanup, install) => {
  const name = path.join(target || process.cwd(), "package.json");

  if (!cleanup) audit(spinner, target, name, install);
  else {
    package(name, async (err, file) => {
      if (err) return console.error(err);

      await file.set({ resolutions });
      await file.save();

      shell.exec(
        `yarn --cwd ${dir} install`,
        {
          silent: true
        },
        () => audit(spinner, target, name, install)
      );
    });
  }
};

const audit = (spinner, target, name, install) => {
  shell.exec(
    `yarn --cwd ${target || process.cwd()} audit --json`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner, name, install)
  );
};

const callback = (response, spinner, name, install) => {
  package(name, async (err, file) => {
    if (err) return console.error(err);

    const json = parseJson(response);

    const { data } = json.filter(data => data.type === "auditSummary")[0];

    const vulnerabilities = Object.values(data.vulnerabilities).reduce(
      (a, b) => a + b
    );

    spinner.succeed(`scanned ${data.totalDependencies} dependencies`);

    spinner.start("building resolutions");

    const advisories = json.filter(data => data.type === "auditAdvisory");

    if (advisories.length === 0)
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

    const old = await file.get("resolutions");

    let fixes = {};

    resolutions.forEach(({ module, patched }) => {
      fixes[module] = patched;
    });

    if (Object.keys(fixes).length > 0) {
      spinner.succeed(`built ${Object.keys(fixes).length} resolutions`);

      spinner.start("saving changes");

      await file.set({ resolutions: fixes });
      await file.save();

      spinner.succeed(`saved package.json`);

      if (install)
        await shell.exec(
          `yarn --cwd ${dir} upgrade ${range}`,
          {
            silent: true
          },
          (_, stdout) => callback(stdout, spinner)
        );
    } else {
      await file.set({ resolutions: old });
      await file.save();

      spinner.fail("something went wrong, reverting any temporary changes");
    }
  });
};

module.exports = { resolve };
