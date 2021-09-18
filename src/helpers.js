const chalk = require('chalk');

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

const isBooleanInput = value => (value === 'true' ? true : value === 'false' ? false : undefined);

module.exports = {
  sum,

  loader,

  stepLabel,
  parseJson,
  colorSize,
  colorError,
  severityBadge,
  colorVariable,
  severityColor,
  isBooleanInput,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
};
