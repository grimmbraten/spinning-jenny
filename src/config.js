const { read, write, isBooleanInput } = require("./helpers");

const Flags = {
  steps: ["--steps", "steps", "-s"], // boolean: display steps as hints (true)
  pattern: ["--pattern", "pattern", "-p"], // string: what pattern jenny is allowed to upgrade packages to (--caret) [--caret, --tilde, --exact]
  backup: ["--backup", "backup", "-b"], // boolean: save previous resolutions object (true)
  frozen: ["--frozen", "frozen", "-f"], // boolean: prevent jenny from modifying the yarn.lock file (false)
  verbose: ["--verbose", "verbose", "-v"] // boolean: print out step messages (true)
};

const configDir = "./src";
const configFile = ".config.json";

const loadConfig = async () => {
  const { data } = await read(configDir, configFile);
  return data;
};

const editConfig = (inputs, spinner) => {
  if (inputs.length === 1)
    return console.log(await read(configDir, configFile));
  inputs.shift();

  inputs.forEach(async (input, index) => {
    if (Flags.verbose.includes(input)) {
      spinner.start("changing verbose mode");

      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("verbose can only be set to true / false");

      await write(configDir, configFile, { verbose: value });
      spinner.succeed("changed verbose to " + value);
    } else if (Flags.frozen.includes(input)) {
      spinner.start("changing frozen mode");

      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("frozen can only be set to true / false");

      await write(configDir, configFile, { frozen: value });
      spinner.succeed("changed frozen to " + value);
    } else if (Flags.backup.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined) return;

      await write(configDir, configFile, { backup: value });
    } else if (Flags.steps.includes(input)) {
      const value = isBooleanInput(inputs[index + 1]);
      if (value === undefined)
        return spinner.fail("steps can only be set to true / false");

      await write(configDir, configFile, { steps: value });
      spinner.succeed("changed steps to " + value);
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
      await write(configDir, configFile, { pattern: `--${value}` });
      spinner.succeed("changed pattern to ", value);
    }
  });
};

module.exports = {
  editConfig,
  loadConfig
};
