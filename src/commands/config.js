const ora = require('ora');
const chalk = require('chalk');

const { load, edit } = require('../config');
const { trueFalse } = require('../constants');
const { parseBoolean, colorProperty } = require('../helpers');

const properties = {
  label: 'label',
  pattern: 'pattern',
  backup: 'backup',
  frozen: 'frozen',
  verbose: 'verbose'
};

const list = async () => {
  const config = await manage();

  if (config) {
    const keys = Object.keys(config).filter(key => key !== 'steps' && key !== 'getStep');

    keys.forEach((key, index) => {
      console.log(`${index === 0 ? '\n' : ''}${key}: ` + colorProperty(config[key]));
    });
  }
};

const manage = async inputs => {
  const spinner = ora('loading configuration').start();

  const config = await load();

  if (!inputs) {
    spinner.succeed('loaded configuration');
    return config;
  }
  inputs = inputs.slice(1);

  delete config.steps;
  delete config.getStep;

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;

    if (properties.verbose === input) {
      const value = parseBoolean(inputs[index + 1]);

      if (value === undefined) {
        spinner.fail(`verbose can only be a boolean (${trueFalse})`);
        return 2;
      }

      config.verbose = value;
      spinner.succeed('set verbose as ' + colorProperty(value));
      return 0;
    } else if (properties.frozen === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) {
        spinner.fail(`frozen can only be a boolean (${trueFalse})`);
        return 2;
      }

      config.frozen = value;
      spinner.succeed('set frozen as ' + colorProperty(value));
      return 0;
    } else if (properties.backup === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) {
        spinner.fail(`backup can only be a boolean (${trueFalse})`);
        return 2;
      }

      config.backup = value;
      spinner.succeed('set backup as ' + colorProperty(value));
      return 0;
    } else if (properties.label === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) {
        spinner.fail(`label can only be a boolean (${trueFalse})`);
        return 2;
      }

      config.label = value;
      spinner.succeed('set label as ' + colorProperty(value));
      return 0;
    } else if (properties.pattern === input) {
      let value = inputs[index + 1];
      value = value?.replace('-', '');

      if (!['exact', 'caret', 'tilde'].includes(value)) {
        spinner.fail(
          `pattern can only be a a distinct value (${chalk.blue('--exact')}, ${chalk.blue(
            '--tilde'
          )}, or ${chalk.blue('--caret')})`
        );
        return 2;
      }

      config.pattern = value;
      spinner.succeed('set pattern as ', colorProperty(value));
      return 0;
    } else {
      spinner.fail(`invalid configuration property ${chalk.red(`(${input})`)}`);
      return 2;
    }
  });

  await edit(config);
};

module.exports = {
  list,
  manage
};
