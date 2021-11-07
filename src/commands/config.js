const chalk = require('chalk');

const { load, edit } = require('../config');
const { parseBoolean, colorProperty } = require('../helpers');

const properties = {
  label: 'label',
  pattern: 'pattern',
  backup: 'backup',
  frozen: 'frozen',
  verbose: 'verbose'
};

const trueFalse = `${chalk.green('true')} / ${chalk.red('false')}`;

const view = async spinner => {
  const config = await manage(spinner);

  if (config) {
    const keys = Object.keys(config).filter(key => key !== 'steps' && key !== 'getStep');

    console.log();
    keys.forEach(key => {
      console.log(`${key}: ` + colorProperty(config[key]));
    });

    console.log(
      chalk.gray(
        '\nfor more information, please refer to the documentation\nhttps://github.com/grimmbraten/spinning-jenny#configuration'
      )
    );
  }
};

const manage = async (spinner, inputs) => {
  const config = await load();

  if (!inputs) return config;
  inputs = inputs.slice(2);

  delete config.steps;
  delete config.getStep;

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;
    spinner.start('modifying configuration');

    if (properties.verbose === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`verbose can only be: ${trueFalse}`);

      config.verbose = value;
      spinner.succeed('verbose: ' + colorProperty(value));
    } else if (properties.frozen === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`frozen can only be: ${trueFalse}`);

      config.frozen = value;
      spinner.succeed('frozen: ' + colorProperty(value));
    } else if (properties.backup === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`backup can only be: ${trueFalse}`);

      config.backup = value;
      spinner.succeed('backup: ' + colorProperty(value));
    } else if (properties.label === input) {
      const value = parseBoolean(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`label can only be: ${trueFalse}`);

      config.label = value;
      spinner.succeed('label: ' + colorProperty(value));
    } else if (properties.pattern === input) {
      let value = inputs[index + 1];
      if (!value) return spinner.fail('please pass a value');

      value = value.replace('-', '');

      if (!['exact', 'caret', 'tilde'].includes(value))
        return spinner.fail(
          `pattern can only be: ${chalk.gray('--exact')} / ${chalk.gray('--tilde')} / ${chalk.gray(
            '--caret'
          )}`
        );

      config.pattern = value;
      spinner.succeed('pattern: ', colorProperty(value));
    } else return spinner.fail(`${input} is not a valid configuration property`);
  });

  console.log();
  Object.keys(config).forEach(key => {
    console.log(`${key}: ` + colorProperty(config[key]));
  });

  await edit(config);
};

module.exports = {
  view,
  manage
};