const path = require('path');
const chalk = require('chalk');
const json = require('json-file-plus');

const sum = collection => Object.values(collection).reduce((a, b) => a + b);

const loader = (verbose, spinner, action, message, step, hint) =>
  verbose && spinner[action](step + message + hint);

const stepLabel = ({ label, steps, getStep }) => {
  if (!label) return '';

  const step = getStep();
  steps.completed++;
  return step;
};

const severityBadge = (severity, count = '') => {
  if (count !== '') count = `${count} `;

  if (severity === 'critical') return chalk.bgMagenta.white(`  ${count}critical  `);
  else if (severity === 'high') return chalk.bgRed.white(`  ${count}high  `);
  else if (severity === 'moderate') return chalk.bgYellow.black(`  ${count}moderate  `);
  else if (severity === 'low') chalk.bgGreen.black(`  ${count}low  `);
  else return chalk.bgBlue.white(`  ${count}info  `);
};

const severityColor = severity => {
  if (severity === 'critical') return chalk.magenta(severity);
  else if (severity === 'high') return chalk.red(severity);
  else if (severity === 'moderate') return chalk.yellow(severity);
  else if (severity === 'low') chalk.green(severity);
  else return chalk.blue(severity);
};

const colorSize = (count, append = '') => {
  if (count > 25) return chalk.red(`${count}${append}`);
  else if (count > 11) return chalk.yellow(`${count}${append}`);
  else return chalk.green(`${count}${append}`);
};

const colorError = err =>
  err
    .replace(/error/g, chalk.red('error'))
    .replace(/warning/g, chalk.yellow('warning'))
    .replace(/Ignoring it./g, chalk.gray('Ignoring it.'));

const colorVariable = value =>
  typeof value === 'string'
    ? chalk.gray(`${value}`)
    : value
    ? chalk.green(`${value}`)
    : chalk.red(`${value}`);

const parseJson = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const extractAuditSummary = json => json.filter(data => data.type === 'auditSummary')[0];

const extractUpgradeOutcome = json => {
  const outcome = json.filter(data => data.type === 'success')[1].data;

  return !outcome ? undefined : outcome.replace('.', '').replace('S', 's');
};

const scannedDependencies = json =>
  json.filter(data => data.type === 'auditSummary')[0].data.totalDependencies;

const resolutionCount = resolutions => Object.entries(resolutions).length;

const isBooleanInput = value => (value === 'true' ? true : value === 'false' ? false : undefined);

const read = (dir, file, property) =>
  new Promise((resolve, reject) => {
    json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      resolve(property ? await json.get(property) : await json.get());
    });
  }).catch(error => {
    console.error(error);
    return [false, error];
  });

const write = (dir, file, property) =>
  new Promise((resolve, reject) => {
    json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      await json.set(property);
      await json.save();
      resolve(true);
    });
  }).catch(err => console.error(err));

const remove = (dir, file, property) =>
  new Promise((resolve, reject) => {
    json(path.join(dir, file), async (err, json) => {
      if (err) reject(err);
      await json.remove(property);
      await json.save();
      resolve(true);
    });
  }).catch(error => {
    console.error(error);
    return false;
  });

module.exports = {
  sum,
  read,
  write,
  loader,
  remove,
  stepLabel,
  parseJson,
  colorSize,
  colorError,
  severityBadge,
  colorVariable,
  severityColor,
  isBooleanInput,
  resolutionCount,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
};
