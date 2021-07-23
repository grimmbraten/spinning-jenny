const chalk = require("chalk");
const {
  sum,
  read,
  write,
  parseJson,
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

  const criticalBadge = critical
    ? chalk.bgMagenta.white(`  ${critical} critical  `)
    : "";
  const highBadge = high ? " " + chalk.bgRed.white(`  ${high} high  `) : "";
  const moderateBadge = moderate
    ? " " + chalk.bgYellow.black(`  ${moderate} moderate  `)
    : "";
  const lowBadge = low ? " " + chalk.bgGreen.black(`  ${low} low  `) : "";
  const infoBadge = info ? " " + chalk.bgBlue.white(`  ${info} info  `) : "";

  verbose &&
    spinner.warn(
      `found ${vulnerabilities} vulnerabilities` +
        hint +
        `\n\n${criticalBadge}${highBadge}${moderateBadge}${lowBadge}${infoBadge}`
    );
};

const resolve = async (response, spinner, hint, target, { verbose }) => {
  let modules = {};
  const json = parseJson(response);
  const { data } = extractAuditSummary(json);
  const vulnerabilities = sum(data.vulnerabilities);

  if (vulnerabilities === 0) {
    verbose && spinner.fail("package.json contains no vulnerabilities" + hint);
    return;
  }

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

  if (resolutions.length === 0) {
    verbose &&
      spinner.fail("failed to resolved package vulnerabilities" + hint);
    return;
  }

  resolutions.forEach(({ module, patched }) => {
    modules[module] = patched;
  });

  await write(target, "package.json", { resolutions: modules });

  verbose &&
    spinner.succeed(`successfully resolved package vulnerabilities` + hint);
};

module.exports = {
  report,
  resolve,
  backups,
  configuration
};
