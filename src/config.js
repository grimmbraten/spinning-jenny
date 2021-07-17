const path = require("path");
const json = require("json-file-plus");

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
        const value = inputs[index + 1];
        if (!value) return;

        if (value === "true") await file.set({ verbose: true });
        else if (value === "false") await file.set({ verbose: false });
      }
    });

    await file.save();
  });
};
