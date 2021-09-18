#!/usr/bin/env node

const ora = require('ora');
const { sequence } = require('all-aboard');

const { load } = require('./config');
const { interpret } = require('./controller');

const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();
  const config = await load();

  const { hint, target, functions, command } = interpret(inputs);

  if (command) return command(spinner, inputs);
  if (!functions) return;

  config.steps.total = functions.length;
  await sequence(functions, [spinner, hint, target, config]);
})();
