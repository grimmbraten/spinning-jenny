#!/usr/bin/env node

require("colors");
const ora = require("ora");

const { controller } = require("./controller");

let promises = [];
const [, , ...inputs] = process.argv;

(async () => {
  let label;
  const spinner = ora();

  const { preparatory, compiler, teardown, target, handler, error, hint } =
    controller(inputs);

  if (error) return spinner.fail(error);

  if (preparatory) {
    label = hint || " preparatory".gray;

    preparatory.forEach(async action => {
      promises.push(action(spinner, label, target));
    });

    await Promise.all(promises);
    promises = [];
  }

  label = hint || " main".gray;

  if (!compiler) return;
  const response = await compiler(spinner, label, target);
  if (!response) return spinner.fail("something went wrong, sorry about that");

  if (!handler) return spinner.fail("something went wrong, sorry about that");
  handler(response, spinner, label, target);

  if (teardown) {
    label = hint || " teardown".gray;
    teardown.forEach(action => {
      promises.push(action(spinner, label, target));
    });

    await Promise.all(promises);
  }
})();
