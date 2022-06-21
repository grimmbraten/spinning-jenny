const { parseWhy, parseAdvisories, parseVulnerabilities } = require('./yarn');
const {
  prefix,
  timely,
  checkpoints,
  colorProperty,
  colorSeverity,
  emojiSeverity
} = require('./output');

const parseBoolean = value => (value === 'true' ? true : value === 'false' ? false : undefined);

module.exports = {
  prefix,
  timely,
  checkpoints,
  parseBoolean,
  colorProperty,
  colorSeverity,
  emojiSeverity,
  parseWhy,
  parseAdvisories,
  parseVulnerabilities
};
