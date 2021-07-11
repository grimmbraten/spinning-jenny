require("colors");
const shell = require("shelljs");
const { parseJson } = require("./helpers");

const audit = (spinner, target = process.cwd()) =>
  shell.exec(
    `yarn --cwd ${target} audit --json`,
    {
      silent: true
    },
    (_, stdout) => callback(stdout, spinner)
  );

const callback = (response, spinner) => {
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

module.exports = { audit };
