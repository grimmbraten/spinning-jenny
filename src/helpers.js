const path = require("path");
const json = require("json-file-plus");

const sum = collection => Object.values(collection).reduce((a, b) => a + b);

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
    await json(path.join(dir, file), (err, json) => {
      if (err) reject(err);
      resolve(property ? json.get(property) : json.get());
    });
  });

const write = (dir, file, property) =>
  new Promise(async (resolve, reject) => {
    await json(path.join(dir, file), (err, json) => {
      if (err) reject(err);
      json.set(property);
      json.save();
      resolve(true);
    });
  });

const remove = (dir, file, property) =>
  new Promise(async (resolve, reject) => {
    await json(path.join(dir, file), (err, json) => {
      if (err) reject(err);
      json.remove(property);
      json.save();
      resolve(true);
    });
  });

module.exports = {
  sum,
  read,
  write,
  remove,
  parseJson,
  isBooleanInput,
  resolutionCount,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
};
