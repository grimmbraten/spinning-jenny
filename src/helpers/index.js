const { prefix, timely, verbosely } = require('./output');
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
  timely,
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
