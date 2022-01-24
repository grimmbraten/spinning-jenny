const { prefix, verbosely } = require('./output');
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
  prefix,
  reduce,
  verbosely,
  parseBoolean,
  colorProperty,
  colorSeverity,
  findAdvisories,
  findAuditSummary,
  findSuccessEvent,
  countDependencies
};
