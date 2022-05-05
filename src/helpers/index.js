const { prefix, timely, randomHold, randomFact, randomEndgame } = require('./output');
const { colorProperty, colorSeverity } = require('./colors');
const {
  reduce,
  findWhyTree,
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
  randomFact,
  randomHold,
  parseBoolean,
  randomEndgame,
  colorProperty,
  colorSeverity,
  findWhyTree,
  findAdvisories,
  findAuditSummary,
  findSuccessEvent,
  countDependencies
};
