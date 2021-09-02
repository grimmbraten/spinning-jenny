const { help } = require('./help');
const { backup } = require('./backup');
const { report } = require('./report');
const { protect } = require('./protect');
const { advisories } = require('./advisories');
const { configuration } = require('./configuration');

module.exports = {
  help,
  report,
  backup,
  protect,
  advisories,
  configuration
};
