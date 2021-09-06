const chalk = require('chalk');

const { read, write, isBooleanInput, colorVariable } = require('./helpers');

const Flags = {
  label: ['--label', 'label', '-l'],
  pattern: ['--pattern', 'pattern', '-p'],
  backup: ['--backup', 'backup', '-b'],
  frozen: ['--frozen', 'frozen', '-f'],
  verbose: ['--verbose', 'verbose', '-v']
};

const configDir = __dirname;
const configFile = '.config.json';
const trueFalse = `${chalk.green('true')} / ${chalk.red('false')}`;

const loadConfig = async () => {
  const config = await read(configDir, configFile);

  config.steps = { total: 0, completed: 0 };
  config.getStep = () => chalk.gray(`${config.steps.completed + 1}/${config.steps.total} `);

  return config;
};

const editConfig = async (spinner, inputs) => {
  const config = await loadConfig();

  if (!inputs) return config;
  inputs = inputs.slice(2);

  delete config.steps;
  delete config.getStep;

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;
    spinner.start('modifying configuration');

    if (Flags.verbose.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`verbose can only be: ${trueFalse}`);

      config.verbose = value;
      spinner.succeed('verbose: ' + colorVariable(value));
    } else if (Flags.frozen.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`frozen can only be: ${trueFalse}`);

      config.frozen = value;
      spinner.succeed('frozen: ' + colorVariable(value));
    } else if (Flags.backup.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`backup can only be: ${trueFalse}`);

      config.backup = value;
      spinner.succeed('backup: ' + colorVariable(value));
    } else if (Flags.label.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined) return spinner.fail(`label can only be: ${trueFalse}`);

      config.label = value;
      spinner.succeed('label: ' + colorVariable(value));
    } else if (Flags.pattern.includes(input)) {
      let value = inputs[index + 1];
      if (!value) return spinner.fail('please pass a value');

      value = value.replace('-', '');

      const allowed = ['exact', 'caret', 'tilde'];
      if (!allowed.includes(value))
        return spinner.fail(
          `pattern can only be: ${chalk.gray('--exact')} / ${chalk.gray('--tilde')} / ${chalk.gray(
            '--caret'
          )}`
        );

      config.pattern = value;
      spinner.succeed('pattern: ', colorVariable(value));
    } else return spinner.fail(`${input} is not a valid configuration property`);
  });

  console.log();
  Object.keys(config).forEach(key => {
    console.log(`${key}: ` + colorVariable(config[key]));
  });

  await write(configDir, configFile, config);
};

module.exports = {
  editConfig,
  loadConfig
};
