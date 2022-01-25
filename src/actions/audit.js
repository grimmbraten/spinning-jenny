const ora = require('ora');
const { execute } = require('../common');
const { reduce, prefix, verbosely, countDependencies, findAuditSummary } = require('../helpers');

const audit = async (hint, target, { verbose, ...config }) => {
  const step = prefix(config);
  const spinner = ora(step + 'auditing module dependencies' + hint).start();

  const [success, response] = await execute(`yarn --cwd ${target} audit --json --summary`);

  if (!success) {
    spinner.fail(step + 'audit failed' + hint);
    if (verbose) verbosely('fail reason', response, 'last');
    return 2;
  }

  const vulnerabilities = reduce(findAuditSummary(response).data.vulnerabilities);
  const dependencies = countDependencies(response);

  if (verbose)
    verbosely(
      `\naudited ${dependencies === 1 ? 'dependency' : 'dependencies'} count`,
      dependencies,
      'last'
    );

  if (vulnerabilities === 0) {
    spinner.succeed(step + 'all dependencies are secure' + hint);
    return 0;
  } else {
    spinner.warn(
      step +
        `detected ${vulnerabilities} ${vulnerabilities > 1 ? 'vulnerabilities' : 'vulnerability'}` +
        hint
    );
    return 1;
  }
};

module.exports = {
  audit
};
