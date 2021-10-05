const { loader, prefix } = require('./output');
const { colorProperty, colorSeverity } = require('./colors');
const {
  reduce,
  parseBoolean,
  findAdvisories,
  findAuditSummary,
  countDependencies,
  findSuccessEvent
} = require('./data');

module.exports = {
  loader,
  prefix,
  reduce,
  parseBoolean,
  colorProperty,
  colorSeverity,
  findAdvisories,
  findAuditSummary,
  findSuccessEvent,
  countDependencies
};
