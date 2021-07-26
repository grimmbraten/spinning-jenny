const chalk = require("chalk");
const {
  sum,
  read,
  write,
  parseJson,
  severityBadge,
  colorVariable,
  extractAuditSummary
} = require("./helpers");
const { editConfig } = require("./config");

const backups = async (spinner, inputs) => {
  const backups = await read("./src", ".backups.json");

  Object.keys(backups).forEach(key => {
    console.log(
      chalk.blue(`\n${key}`) +
        ` (${Object.entries(backups[key].resolutions).length} resolutions)` +
        chalk.gray(`\n${backups[key].date}`)
    );
  });
};

const configuration = async (spinner, inputs) => {
  const config = await editConfig(spinner, inputs);

  if (config) {
    const keys = Object.keys(config).filter(
      key => key !== "steps" && key !== "getStep"
    );

    console.log();
    keys.forEach(key => {
      console.log(`${key}: ` + colorVariable(config[key]));
    });

    console.log(
      chalk.gray(
        "\nfor more information, please refer to the documentation\nhttps://github.com/grimmbraten/spinning-jenny"
      )
    );
  }
};

const report = (response, spinner, hint, target, { verbose }) => {
  const json = parseJson(response);
  const { data } = extractAuditSummary(json);
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === 0) {
    verbose &&
      spinner.succeed("package.json contains no vulnerabilities" + hint);
    return;
  }

  const {
    vulnerabilities: { critical, high, moderate, low, info }
  } = data;

  const criticalBadge = critical ? severityBadge("critical", critical) : "";
  const highBadge = high ? " " + severityBadge("high", high) : "";
  const moderateBadge = moderate
    ? " " + severityBadge("moderate", moderate)
    : "";
  const lowBadge = low ? " " + severityBadge("low", low) : "";
  const infoBadge = info ? " " + severityBadge("info", info) : "";

  verbose
    ? spinner.warn(
        `found ${vulnerabilities} vulnerabilities` +
          hint +
          `\n\n${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`
      )
    : console.log(
        `\n${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`
      );
};

const resolve = async (response, spinner, hint, target, { verbose }) => {
  let modules = {};
  const json = parseJson(response);
  const { data } = extractAuditSummary(json);
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === 0) {
    verbose && spinner.succeed("no vulnerabilities detected" + hint);
    return;
  }

  if (verbose) spinner.text = `resolving vulnerabilities` + hint;

  let resolutions = json
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
    .filter(data => data);

  const noPatch = resolutions.filter(({ patched }) => patched === "<0.0.0");
  resolutions = resolutions.filter(({ patched }) => patched !== "<0.0.0");

  if (resolutions.length === 0) {
    verbose && spinner.fail("failed to resolved vulnerabilities" + hint);
    return;
  }

  resolutions.forEach(({ module, patched }) => {
    modules[module] = patched;
  });

  await write(target, "package.json", { resolutions: modules });

  if (verbose) {
    spinner.succeed(`successfully resolved vulnerabilities` + hint);
    if (noPatch.length > 0)
      spinner.warn(
        `found ${noPatch.length} package(s) without a patch\n\n${chalk.gray(
          `please run ${chalk.white(
            `spinning-jenny --patches${target ? ` --directory ${target}` : ""}`
          )} for more information`
        )}`
      );
  }
};

const patches = (response, spinner, hint, target, { verbose }) => {
  const json = parseJson(response);

  if (verbose) spinner.text = `analyzing vulnerabilities` + hint;

  let resolutions = json
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
    .filter(data => data);

  const unique = [...new Set(resolutions.map(package => package.module))];

  const patches = unique.map(module =>
    resolutions.find(package => package.module === module)
  );

  if (patches.length === 0) {
    verbose && spinner.fail("failed to analyze vulnerabilities" + hint);
    return;
  }

  verbose &&
    spinner.succeed(
      `found ${patches.length} module(s) with vulnerabilities` + hint
    );

  patches.forEach(patch => {
    console.log(
      `\n${severityBadge(patch.severity)}\n${patch.module}${chalk.gray(
        `@${patch.version}`
      )}\npatched: ${
        patch.patched !== "<0.0.0" ? chalk.green("true") : chalk.red("false")
      }\nvulnerability: ${patch.title.toLowerCase()}\n${chalk.gray(patch.url)}`
    );
  });
};

module.exports = {
  report,
  resolve,
  backups,
  patches,
  configuration
};
