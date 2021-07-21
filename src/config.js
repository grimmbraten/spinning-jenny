const { read, write, isBooleanInput } = require("./helpers");

const Flags = {
  label: ["--label", "label", "-l"], // boolean: display label before printout (true)
  pattern: ["--pattern", "pattern", "-p"], // string: what pattern jenny is allowed to upgrade packages to (--caret) [--caret, --tilde, --exact]
  backup: ["--backup", "backup", "-b"], // boolean: save previous resolutions object (true)
  frozen: ["--frozen", "frozen", "-f"], // boolean: prevent jenny from modifying the yarn.lock file (false)
  verbose: ["--verbose", "verbose", "-v"] // boolean: print out step messages (true)
};

const configDir = "./src";
const configFile = ".config.json";

const loadConfig = async () => ({
  steps: { total: 0, completed: 0 },
  ...(await read(configDir, configFile))
});

const editConfig = async (inputs, spinner) => {
  let config = await loadConfig();

  if (inputs.length === 1) return console.log(config);
  inputs.shift();

  inputs.forEach((input, index) => {
    if (index % 2 === 1) return;

    if (Flags.verbose.includes(input)) {
      spinner.start("changing verbose mode");

      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("verbose can only be set to true / false");

      config.verbose = value;
      spinner.succeed("changed verbose to " + value);
    } else if (Flags.frozen.includes(input)) {
      spinner.start("changing frozen mode");

      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      config.frozen = value;
      spinner.succeed("changed frozen to " + value);
    } else if (Flags.backup.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      config.backup = value;
      spinner.succeed("changed backup to " + value);
    } else if (Flags.label.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("label can only be set to true / false");

      config.label = value;
      spinner.succeed("changed label to " + value);
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
      spinner.succeed("changed pattern to ", value);
    }
  });

  await write(configDir, configFile, config);
};

module.exports = {
  editConfig,
  loadConfig
};
