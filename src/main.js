#!/usr/bin/env node

require("colors");
const ora = require("ora");

const { backup } = require("./compilers");
const { controller } = require("./controller");
const { editConfig, loadConfig } = require("./config");

let label;
let promises = [];
const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();
  if (inputs[0] === "config") return editConfig(inputs, spinner);

  const config = await loadConfig();

  !config.verbose && spinner.start("working");

  const { preparatory, compiler, teardown, target, handler, error, hint } =
    controller(inputs, config);

  if (error) return spinner.fail(error);

  if (config.backup) await backup(spinner, hint, target, config);

  if (preparatory) {
    label = hint + config.steps ? " [preparatory]".gray : "";

    preparatory.forEach(async action => {
      promises.push(action(spinner, label, target));
    });

    await Promise.all(promises);
    promises = [];
  }

  label = hint + config.steps ? " [main]".gray : "";

  if (!compiler) return;
  const response = await compiler(spinner, label, target, config);
  if (!response) return spinner.fail("something went wrong, sorry about that");

  if (!handler) return spinner.fail("something went wrong, sorry about that");
  handler(response, spinner, label, target, config);

  if (teardown) {
    label = hint + config.steps ? " [teardown]".gray : "";
    teardown.forEach(action => {
      promises.push(action(spinner, label, target));
    });

    await Promise.all(promises);

    if (!verbose) spinner.succeed("done");
  }
})();
