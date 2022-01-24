const { execute } = require('./shell');

const audit = async (target, scope = '') =>
  await execute(`yarn --cwd ${target} audit --json ${scope}`);

module.exports = {
  audit
};
