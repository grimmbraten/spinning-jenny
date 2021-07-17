const path = require("path");
const json = require("json-file-plus");
const { isBooleanInput } = require("./handlers");

const Flags = {
  steps: ["--steps", "-s"], // boolean: display steps as hints (true)
  pattern: ["--pattern", "-p"], // string: what pattern jenny is allowed to upgrade packages to (--caret) [--caret, --tilde, --exact]
  backup: ["--backup", "-b"], // boolean: save previous resolutions object (false)
  frozen: ["--frozen", "-f"], // boolean: prevent jenny from modifying the yarn.lock file (false)
  verbose: ["--verbose", "-v"] // boolean: print out step messages (true)
};

module.exports = inputs => {
  const name = path.join("./src", ".config.json");

  json(name, async (err, file) => {
    if (inputs.length === 1) return console.log(await file.get());
    inputs.shift();

    inputs.forEach(async (input, index) => {
      if (Flags.verbose.includes(input)) {
        const value = isBooleanInput(inputs[index + 1]);
        if (value === undefined) return;

        await file.set({ verbose: value });
      } else if (Flags.frozen.includes(input)) {
        const value = isBooleanInput(inputs[index + 1]);
        if (value === undefined) return;

        await file.set({ frozen: value });
      } else if (Flags.backup.includes(input)) {
        const value = isBooleanInput(inputs[index + 1]);
        if (value === undefined) return;

        await file.set({ backup: value });
      } else if (Flags.steps.includes(input)) {
        const value = isBooleanInput(inputs[index + 1]);
        if (value === undefined) return;

        await file.set({ steps: value });
      } else if (Flags.pattern.includes(input)) {
        let value = inputs[index + 1];
        if (!value) return;

        value = value.replace("-", "");

        const allowed = ["exact", "caret", "tilde"];
        if (!allowed.includes(value))
          return console.log("invalid pattern value");
        await file.set({ pattern: `--${value}` });
      }
    });

    await file.save();
  });
};
