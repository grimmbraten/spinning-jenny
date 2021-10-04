const { loader, stepLabel } = require('./output');
const { colorProperty, colorSeverity } = require('./colors');
const {
  sum,
  parseJson,
  isBooleanInput,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome
} = require('./data');

module.exports = {
  loader,
  stepLabel,
  sum,
  parseJson,
  isBooleanInput,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome,
  colorProperty,
  colorSeverity
};
