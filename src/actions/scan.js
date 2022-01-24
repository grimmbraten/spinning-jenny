const ora = require('ora');
const { audit } = require('../common');
const { reduce, prefix, verbosely, countDependencies, findAuditSummary } = require('../helpers');

const scan = async (hint, target, { verbose, ...config }) => {
  const step = prefix(config);
  const spinner = ora(step + 'auditing module dependencies' + hint).start();

  const [success, response] = await audit(target, '--summary');
  if (!success) {
    spinner.fail(step + 'audit failed' + hint);
    if (verbose) verbosely('fail reason', response, 'last');
    return 2;
  }

  const vulnerabilities = reduce(findAuditSummary(response).data.vulnerabilities);
  const dependencies = countDependencies(response);

  if (verbose)
    verbosely(
      `audited ${dependencies === 1 ? 'dependency' : 'dependencies'} count`,
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
  scan
};
