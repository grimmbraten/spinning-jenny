#!/usr/bin/env node

require("colors");
const ora = require("ora");

const { read } = require("./helpers");
const { backup } = require("./compilers");
const { controller } = require("./controller");
const { editConfig, loadConfig } = require("./config");

const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();
  if (inputs[0] === "config") return editConfig(inputs, spinner);
  else if (inputs[0] === "backups")
    return console.log(await read("./src", ".backups.json"));

  const config = await loadConfig();

  !config.verbose && spinner.start("working");

  const { preparatory, compiler, teardown, target, handler, error, hint } =
    controller(inputs, config);

  if (error) return spinner.fail(error);

  config.steps.total =
    preparatory.length + teardown.length + (compiler ? 1 : 0);

  config["getSteps"] = () =>
    config.label
      ? `[${config.steps.completed + 1}/${config.steps.total}] `.gray
      : "";

  if (config.backup) await backup(spinner, hint, target, config);

  if (preparatory) {
    const resolve = Promise.resolve(null);
    await preparatory.reduce(
      (promise, action) =>
        promise.then(() => action(spinner, hint, target, config)),
      resolve
    );
  }

  if (!compiler) return;
  const response = await compiler(spinner, hint, target, config);
  if (!response) return spinner.fail("something went wrong, sorry about that");

  if (!handler) return spinner.fail("something went wrong, sorry about that");
  handler(response, spinner, hint, target, config);

  if (teardown) {
    const resolve = Promise.resolve(null);
    await teardown.reduce(
      (promise, action) =>
        promise.then(() => action(spinner, hint, target, config)),
      resolve
    );

    if (!config.verbose) spinner.succeed("done");
  }
})();
