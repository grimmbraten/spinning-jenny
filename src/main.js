#!/usr/bin/env node

const ora = require('ora');
const { sequence } = require('all-aboard');

const { load } = require('./config');
const { interpret } = require('./controller');

const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();
  const fileConfig = await load();

  const { hint, target, config, command, functions } = interpret(inputs, fileConfig);

  if (command) return command(spinner, inputs);
  if (functions) await sequence(functions, [spinner, hint, target, config]);
})();
