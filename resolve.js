const path = require("path");
const shell = require("shelljs");
const package = require("json-file-plus");

const resolve = (spinner, target, cleanup, install) => {
  const name = path.join(target || process.cwd(), "package.json");

  if (cleanup) {
    package(name, async (err, file) => {
      if (err) return console.error(err);

      await file.set({ resolutions });
      await file.save();

      audit(spinner, name, install);
    });
  } else audit(spinner, name, install);
};

const audit = (spinner, target = process.cwd(), name, install) =>
  shell.exec(
    `yarn --cwd ${target} audit --json`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner, name, install)
  );

const callback = (response, spinner, name, install) => {
  package(name, async (err, file) => {
    if (err) return console.error(err);

    const json = parseJson(response);

    const { data } = json.filter(data => data.type === "auditSummary")[0];

    const vulnerabilities = Object.values(data.vulnerabilities).reduce(
      (a, b) => a + b
    );

    spinner.succeed(`scanned ${data.totalDependencies} dependencies`);

    const resolutionSpinner = ora("building resolutions").start();

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
      resolutionSpinner.succeed(
        `built ${Object.keys(fixes).length} resolutions`
      );

      const saveSpinner = ora("saving changes").start();

      await file.set({ resolutions: fixes });
      await file.save();

      saveSpinner.succeed(`saved package.json`);

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

      resolutionSpinner.fail(
        "something went wrong, reverting any temporary changes"
      );
    }
  });
};

module.exports = { resolve };
