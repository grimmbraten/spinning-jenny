const ora = require('ora');
const { audit } = require('~services/yarn');
const { fail, warn, succeed } = require('~services/ora');
const { prefix, timely, checkpoints, parseVulnerabilities } = require('~helpers');

const handler = async (hint, target, config) => {
  const timeouts = [];

  const step = prefix(config);
  const spinner = ora(step + 'auditing dependencies' + hint).start();

  checkpoints.forEach(({ time, content }) =>
    timeouts.push(timely(spinner, step, 'auditing dependencies', content, time))
  );

  const [success, response] = await audit(target);

  timeouts.forEach(timeout => clearTimeout(timeout));

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
