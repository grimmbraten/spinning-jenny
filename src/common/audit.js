const { execute } = require('./shell');
const { loader } = require('../helpers');

const audit = async (spinner, hint, target, verbose, step, scope = '') => {
  loader(spinner, 'start', 'scanning package.json', step, hint);
  return await execute(`yarn --cwd ${target} audit --json ${scope}`);
};

module.exports = {
  audit
};
