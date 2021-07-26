const path = require("path");
const chalk = require("chalk");
const json = require("json-file-plus");

const sum = collection => Object.values(collection).reduce((a, b) => a + b);

const severityBadge = (severity, count = "") => {
  if (count !== "") count = `${count} `;

  if (severity === "critical")
    return chalk.bgMagenta.white(`  ${count}critical  `);
  else if (severity === "high") return chalk.bgRed.white(`  ${count}high  `);
  else if (severity === "moderate")
    return chalk.bgYellow.black(`  ${count}moderate  `);
  else if (severity === "low") chalk.bgGreen.black(`  ${count}low  `);
  else return chalk.bgBlue.white(`  ${count}info  `);
};

const colorVariable = value =>
  typeof value === "string"
    ? chalk.gray(`${value}`)
    : value
    ? chalk.green(`${value}`)
    : chalk.red(`${value}`);

const parseJson = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const extractAuditSummary = json =>
  json.filter(data => data.type === "auditSummary")[0];

const extractUpgradeOutcome = json => {
  const outcome = json.filter(data => data.type === "success")[1].data;
  if (!outcome) return;

  return outcome.replace(".", "").replace("S", "s");
};

const scannedDependencies = json =>
  json.filter(data => data.type === "auditSummary")[0].data.totalDependencies;

const resolutionCount = resolutions => Object.entries(resolutions).length;

const isBooleanInput = value =>
  value === "true" ? true : value === "false" ? false : undefined;

const read = (dir, file, property) =>
  new Promise(async (resolve, reject) => {
    await json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      resolve(property ? await json.get(property) : await json.get());
    });
  });

const write = (dir, file, property) =>
  new Promise(async (resolve, reject) => {
    await json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      await json.set(property);
      await json.save();
      resolve(true);
    });
  });

const remove = (dir, file, property) =>
  new Promise(async (resolve, reject) => {
    await json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      await json.remove(property);
      await json.save();
      resolve(true);
    });
  });

module.exports = {
  sum,
  read,
  write,
  remove,
  parseJson,
  severityBadge,
  colorVariable,
  isBooleanInput,
  resolutionCount,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
};
