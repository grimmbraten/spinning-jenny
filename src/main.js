#!/usr/bin/env node

require("colors");
const ora = require("ora");

const { controller } = require("./controller");

let promises = [];
const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();

  const { preparatory, compiler, teardown, target, handler, error, hint } =
    controller(inputs);

  if (error) return spinner.fail(error);

  preparatory.forEach(async action => {
    promises.push(action(spinner, hint, target));
  });

  await Promise.all(promises);
  promises = [];

  const response = await compiler(spinner, hint, target);

  if (!response) return spinner.fail("something went wrong, sorry about that");

  teardown.forEach(action => {
    promises.push(action(spinner, hint, target));
  });

  await Promise.all(promises);

  handler && handler(response, spinner, hint, target);
})();
