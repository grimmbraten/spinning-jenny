const { read, write, isBooleanInput } = require("./helpers");

const Flags = {
  label: ["--label", "label", "-l"],
  pattern: ["--pattern", "pattern", "-p"],
  backup: ["--backup", "backup", "-b"],
  frozen: ["--frozen", "frozen", "-f"],
  verbose: ["--verbose", "verbose", "-v"]
};

const configDir = "./src";
const configFile = ".config.json";

const loadConfig = async () => ({
  steps: { total: 0, completed: 0 },
  ...(await read(configDir, configFile))
});

const editConfig = async (spinner, inputs) => {
  let config = await loadConfig();

  if (inputs.length === 1) return config;
  inputs.shift();

  delete config.steps;

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;

    if (Flags.verbose.includes(input)) {
      spinner.start("changing verbose mode");

      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("verbose can only be set to true / false");

      config.verbose = value;
      spinner.info("changed verbose to " + value);
    } else if (Flags.frozen.includes(input)) {
      spinner.start("changing frozen mode");

      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      config.frozen = value;
      spinner.info("changed frozen to " + value);
    } else if (Flags.backup.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      config.backup = value;
      spinner.info("changed backup to " + value);
    } else if (Flags.label.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("label can only be set to true / false");

      config.label = value;
      spinner.info("changed label to " + value);
    } else if (Flags.pattern.includes(input)) {
      spinner.start("changing upgrade pattern");

      let value = inputs[index + 1];
      if (!value) return spinner.fail("please pass a value");

      value = value.replace("-", "");

      const allowed = ["exact", "caret", "tilde"];
      if (!allowed.includes(value))
        return spinner.fail(
          "pattern can only be set to exact, tilde, or caret"
        );

      config.pattern = value;
      spinner.info("changed pattern to ", value);
    }
  });

  await write(configDir, configFile, config);
};

module.exports = {
  editConfig,
  loadConfig
};
