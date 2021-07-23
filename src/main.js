#!/usr/bin/env node

const ora = require("ora");
const { loadConfig } = require("./config");
const { controller } = require("./controller");

const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();
  const config = await loadConfig();

  const {
    hint,
    error,
    target,
    special,
    handler,
    teardown,
    compiler,
    preparatory
  } = controller(inputs, config);

  if (error) return spinner.fail(error);
  else if (special) return special(spinner, inputs);

  config.steps.total =
    preparatory.length + teardown.length + (compiler ? 1 : 0);

  !config.verbose && spinner.start("working");

  if (preparatory) {
    const resolve = Promise.resolve(null);
    await preparatory.reduce(
      (promise, action) =>
        promise.then(() => action(spinner, hint, target, config)),
      resolve
    );
  }

  const response = compiler
    ? await compiler(spinner, hint, target, config)
    : undefined;

  if (!response || !handler)
    return spinner.fail("something went wrong, sorry about that");

  handler(response, spinner, hint, target, config);

  if (teardown) {
    const resolve = Promise.resolve(null);
    await teardown.reduce(
      (promise, action) =>
        promise.then(() => action(spinner, hint, target, config)),
      resolve
    );
  }

  !config.verbose && spinner.succeed("completed without any issues");
})();
