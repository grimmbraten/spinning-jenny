require("colors");
const path = require("path");
const package = require("json-file-plus");
const { parseJson } = require("./helpers");

const fix = (response, spinner) => {
  const json = parseJson(response);

  const advisories = json.filter(data => data.type === "auditAdvisory");

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

  const name = path.join(process.cwd(), "test.json");

  package(name, async (err, file) => {
    if (err) return console.error(err);

    const old = await file.get("resolutions");

    let collection = old || {};

    resolutions.forEach(({ module, patched }) => {
      collection[module] = patched;
    });

    if (resolutions.length > 0) {
      await file.set({ resolutions: collection });
      await file.save();
      spinner.succeed("yes!");
    } else {
      spinner.fail("nope");
    }
  });
};

const summary = (response, spinner) => {
  const json = parseJson(response);
  const { data } = json.filter(data => data.type === "auditSummary")[0];

  const vulnerabilities = Object.values(data.vulnerabilities).reduce(
    (a, b) => a + b
  );

  if (vulnerabilities === 0)
    return spinner.succeed(
      "no vulnerabilities found" +
        ` (scanned ${data.totalDependencies} dependencies)`.gray
    );

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalCount = critical
    ? ` ${critical} critical `.bgMagenta.white
    : "";
  const highCount = high ? ` ${high} high `.bgRed.white : "";
  const moderateCount = moderate ? ` ${moderate} moderate `.bgYellow.black : "";
  const lowCount = low ? ` ${low} low `.bgGreen.black : "";
  const infoCount = info ? ` ${info} info `.bgBlue.white : "";

  return spinner.fail(
    `${vulnerabilities} vulnerabilities found` +
      ` (scanned ${data.totalDependencies} dependencies)\n`.gray +
      `${criticalCount} ${highCount} ${moderateCount} ${lowCount} ${infoCount}`
  );
};

module.exports = { fix, summary };
