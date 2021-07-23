require("colors");

const { read, write, isBooleanInput, colorVariable } = require("./helpers");

const Flags = {
  label: ["--label", "label", "-l"],
  pattern: ["--pattern", "pattern", "-p"],
  backup: ["--backup", "backup", "-b"],
  frozen: ["--frozen", "frozen", "-f"],
  verbose: ["--verbose", "verbose", "-v"]
};

const configDir = "./src";
const configFile = ".config.json";

const loadConfig = async () => {
  const config = await read(configDir, configFile);

  config["steps"] = { total: 0, completed: 0 };
  config["getStep"] = () =>
    config.label
      ? `[${config.steps.completed + 1}/${config.steps.total}] `.gray
      : "";

  return config;
};

const editConfig = async (spinner, inputs) => {
  let config = await loadConfig();

  if (inputs.length === 1) return config;
  inputs.shift();

  delete config.steps;
  delete config.getStep;

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;
    spinner.start("updating configuration");

    if (Flags.verbose.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("verbose can only be set to true / false");

      config.verbose = value;
      spinner.info("set verbose to " + colorVariable(value));
    } else if (Flags.frozen.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      config.frozen = value;
      spinner.info("set frozen to " + colorVariable(value));
    } else if (Flags.backup.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      config.backup = value;
      spinner.info("set backup to " + colorVariable(value));
    } else if (Flags.label.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("label can only be set to true / false");

      config.label = value;
      spinner.info("set label to " + colorVariable(value));
    } else if (Flags.pattern.includes(input)) {
      let value = inputs[index + 1];
      if (!value) return spinner.fail("please pass a value");

      value = value.replace("-", "");

      const allowed = ["exact", "caret", "tilde"];
      if (!allowed.includes(value))
        return spinner.fail(
          "pattern can only be set to exact, tilde, or caret"
        );

      config.pattern = value;
      spinner.info("set pattern to ", colorVariable(value));
    }
  });

  await write(configDir, configFile, config);
};

module.exports = {
  editConfig,
  loadConfig
};
