const path = require("path");
const json = require("json-file-plus");

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

const read = async (dir, file, property) =>
  await json(path.join(dir, file), async (err, json) => {
    if (err) return console.error(`could not find ${dir}/${file}`);
    return await json.get(property);
  });

const write = async (dir, file, property) =>
  await json(path.join(dir, file), async (err, json) => {
    if (err) return console.error(`could not find ${dir}/${file}`);
    await json.set(property);
    await json.save();
    return true;
  });

module.exports = {
  read,
  write,
  parseJson,
  isBooleanInput,
  resolutionCount,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
};
