#!/usr/bin/env node

require("colors");
const ora = require("ora");

const { controller } = require("./controller");

const spinner = ora();

let promises = [];
const [, , ...inputs] = process.argv;

(async () => {
  const { preparatory, compiler, teardown, target, handler, error } =
    controller(inputs);

  if (error) return spinner.fail(error);

  const hint = target !== process.cwd() ? ` in (${target})`.gray : "";

  preparatory.forEach(async action => {
    promises.push(action(spinner, hint, target));
  });

  await Promise.all(promises);

  promises = [];
  const response = await compiler(spinner, hint, target);

  teardown.forEach(action => {
    promises.push(action(spinner, hint, target));
  });

  await Promise.all(promises);

  if (handler) handler(response, spinner, hint, target);
})();
