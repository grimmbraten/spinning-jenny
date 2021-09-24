const { loader, stepLabel } = require('./output');
const { colorSize, colorError, colorVariable, severityColor } = require('./colors');
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
  colorSize,
  colorError,
  colorVariable,
  severityColor
};
