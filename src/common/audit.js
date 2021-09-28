const { execute } = require('./shell');
const { loader } = require('../helpers');

const audit = async (spinner, hint, target, verbose, step) => {
  loader(verbose, spinner, 'start', 'scanning package.json', step, hint);

  const [success, response] = await execute(`yarn --cwd ${target} audit --json`);
  return [success, response];
};

module.exports = {
  audit
};
