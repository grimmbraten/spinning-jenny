const { prefix, timely, verbosely, randomHold, randomFact, randomEndgame } = require('./output');
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
  randomFact,
  randomHold,
  parseBoolean,
  randomEndgame,
  colorProperty,
  colorSeverity,
  findAdvisories,
  findAuditSummary,
  findSuccessEvent,
  countDependencies
};
