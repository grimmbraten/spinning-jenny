require("colors");

const path = require("path");
const package = require("json-file-plus");
const { parseJson } = require("./helpers");

const summary = (response, spinner, hint, target, teardown) => {
  const json = parseJson(response);
  const { data } = json.filter(data => data.type === "auditSummary")[0];

  const vulnerabilities = Object.values(data.vulnerabilities).reduce(
    (a, b) => a + b
  );

  if (vulnerabilities === 0)
    return spinner.succeed(
      "no vulnerabilities found" +
        hint +
        "\n\n " +
        `  ${data.totalDependencies} dependencies scanned  `.bgGray.white
    );

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalCount = critical
    ? ` ${critical} critical `.bgMagenta.white
    : "";
  const highCount = high ? " " + ` ${high} high `.bgRed.white : "";
  const moderateCount = moderate
    ? " " + `  ${moderate} moderate  `.bgYellow.black
    : "";
  const lowCount = low ? " " + `  ${low} low  `.bgGreen.black : "";
  const infoCount = info ? " " + `  ${info} info  `.bgBlue.white : "";

  spinner.fail(
    `${vulnerabilities} vulnerabilities found` +
      hint +
      `\n\n${criticalCount}${highCount}${moderateCount}${lowCount}${infoCount}` +
      " " +
      `  ${data.totalDependencies} dependencies scanned  `.bgGray.white
  );
};

const twist = (response, spinner, hint, target, teardown) => {
  const name = path.join(target, "package.json");

  spinner.text = "locating package.json file";

  package(name, async (err, file) => {
    if (err) return spinner.fail(`could not find ${name}`);

    const json = parseJson(response);
    const { data } = json.filter(data => data.type === "auditSummary")[0];

    const vulnerabilities = Object.values(data.vulnerabilities).reduce(
      (a, b) => a + b
    );

    if (vulnerabilities === 0)
      return spinner.fail("no vulnerabilities found" + hint);

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

    spinner.text = `building resolutions`;

    if (resolutions.length === 0)
      return spinner.fail("failed to build resolutions");

    //TODO: add a save option in a settings file
    //const old = await file.get("resolutions");

    let modules = {};

    resolutions.forEach(({ module, patched }) => {
      modules[module] = patched;
    });

    await file.set({ resolutions: modules });
    await file.save();

    if (!teardown) spinner.succeed(`twisted yarn successfully`);
    else teardown(spinner, hint, target);
  });
};

module.exports = {
  twist,
  summary
};
