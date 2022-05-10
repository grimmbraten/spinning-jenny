const ora = require('ora');
const { shell } = require('../services/shelljs');
const { reduce, prefix, findAuditSummary } = require('../helpers');

const audit = async (hint, target, config) => {
  const step = prefix(config);
  const spinner = ora(step + 'auditing module dependencies' + hint).start();

  const [success, response] = await shell(`yarn --cwd ${target} audit --json --summary`);

  if (!success) {
    spinner.fail(step + `audit failed\n\n${response}` + hint);
    return 2;
  }

  const vulnerabilities = reduce(findAuditSummary(response).data.vulnerabilities);

  if (vulnerabilities === 0) {
    spinner.succeed(
      step + 'found no potential security vulnerabilities in your dependencies' + hint
    );
    return 0;
  } else {
    spinner.warn(
      step +
        `found ${vulnerabilities} potential security ${
          vulnerabilities > 1 ? 'vulnerabilities' : 'vulnerability'
        } in your dependencies` +
        hint
    );
    return 1;
  }
};

module.exports = {
  audit
};
