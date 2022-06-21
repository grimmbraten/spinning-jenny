const ora = require('ora');
const { audit } = require('~services/yarn');
const { fail, warn, succeed } = require('~services/ora');
const { prefix, parseVulnerabilities } = require('~helpers');

const handler = async (hint, target, config) => {
  const step = prefix(config);
  const spinner = ora(step + 'auditing dependencies' + hint).start();

  const [success, response] = await audit(target);
  if (!success) return fail(spinner, step, hint, 'audit failed', response);

  const vulnerabilities = parseVulnerabilities(response);

  if (vulnerabilities > 0)
    return warn(
      spinner,
      step,
      hint,
      `found ${vulnerabilities} potential security ${
        vulnerabilities > 1 ? 'vulnerabilities' : 'vulnerability'
      } in your dependencies`
    );

  return succeed(
    spinner,
    step,
    hint,
    'found no potential security vulnerabilities in your dependencies'
  );
};

module.exports = {
  audit: handler
};
