const { loader, prefix } = require('./output');
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
  prefix,
  sum,
  parseJson,
  isBooleanInput,
  extractAuditSummary,
  scannedDependencies,
  extractUpgradeOutcome,
  colorProperty,
  colorSeverity
};
