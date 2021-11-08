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

const list = async spinner => {
  const config = await manage(spinner);

  if (config) {
    const keys = Object.keys(config).filter(key => key !== 'steps' && key !== 'getStep');

    console.log();
    keys.forEach(key => {
      console.log(`${key}: ` + colorProperty(config[key]));
    });
  }
};

const manage = async (spinner, inputs) => {
  const config = await load();

  if (!inputs) return config;
  inputs = inputs.slice(1);

  delete config.steps;
  delete config.getStep;

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;
    spinner.start('modifying configuration');

    if (properties.verbose === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`verbose can only be ${trueFalse}`);

      config.verbose = value;
      spinner.succeed('changed verbose to ' + colorProperty(value));
    } else if (properties.frozen === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`frozen can only be ${trueFalse}`);

      config.frozen = value;
      spinner.succeed('changed frozen to ' + colorProperty(value));
    } else if (properties.backup === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`backup can only be ${trueFalse}`);

      config.backup = value;
      spinner.succeed('changed backup to ' + colorProperty(value));
    } else if (properties.label === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`label can only be ${trueFalse}`);

      config.label = value;
      spinner.succeed('changed label to ' + colorProperty(value));
    } else if (properties.pattern === input) {
      let value = inputs[index + 1];
      if (!value) return spinner.fail('please pass a value');

      value = value.replace('-', '');

      if (!['exact', 'caret', 'tilde'].includes(value))
        return spinner.fail(
          `pattern can only be ${chalk.gray('--exact')}, ${chalk.gray('--tilde')}, or ${chalk.gray(
            '--caret'
          )}`
        );

      config.pattern = value;
      spinner.succeed('changed pattern to ', colorProperty(value));
    } else return spinner.fail(`${input} is not a config property`);
  });

  await edit(config);
};

module.exports = {
  list,
  manage
};
