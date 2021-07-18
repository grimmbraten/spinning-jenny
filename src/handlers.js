require("colors");

const path = require("path");
const json = require("json-file-plus");
const { parseJson, extractAuditSummary } = require("./helpers");

const report = (response, spinner, hint, { verbose }) => {
  const json = parseJson(response);
  const { data } = extractAuditSummary(json);

  const vulnerabilities = Object.values(data.vulnerabilities).reduce(
    (a, b) => a + b
  );

  if (vulnerabilities === 0)
    return (
      verbose && spinner.succeed("package.json has no vulnerabilities" + hint)
    );

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalBadge = critical
    ? ` ${critical} critical `.bgMagenta.white
    : "";
  const highBadge = high ? " " + ` ${high} high `.bgRed.white : "";
  const moderateBadge = moderate
    ? " " + `  ${moderate} moderate  `.bgYellow.black
    : "";
  const lowBadge = low ? " " + `  ${low} low  `.bgGreen.black : "";
  const infoBadge = info ? " " + `  ${info} info  `.bgBlue.white : "";

  verbose &&
    spinner.warn(
      `found ${vulnerabilities} vulnerabilities` +
        hint +
        `\n\n${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`
    );
};

const twist = (response, spinner, hint, target, { verbose }) => {
  const name = path.join(target, "package.json");

  if (verbose) spinner.text = "locating package.json file";

  json(name, async (err, file) => {
    if (err) return verbose && spinner.fail(`could not find ${name}`);

    const json = parseJson(response);
    const { data } = extractAuditSummary(json);

    const vulnerabilities = Object.values(data.vulnerabilities).reduce(
      (a, b) => a + b
    );

    if (vulnerabilities === 0)
      return verbose && spinner.fail("no vulnerabilities found" + hint);

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

    if (verbose) spinner.text = `building resolutions`;

    if (resolutions.length === 0)
      return verbose && spinner.fail("failed to build resolutions");

    //TODO: add a save option in a settings file
    //const old = await file.get("resolutions");

    let modules = {};

    resolutions.forEach(({ module, patched }) => {
      modules[module] = patched;
    });

    await file.set({ resolutions: modules });
    await file.save();

    verbose && spinner.succeed(`twisted yarn successfully`);
  });
};

module.exports = {
  twist,
  report
};
