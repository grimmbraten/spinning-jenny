#!/usr/bin/env node

const ora = require('ora');
const { sequence } = require('all-aboard');

const { load } = require('./config');
const { interpret } = require('./controller');

const [, , ...inputs] = process.argv;

(async () => {
  const spinner = ora();
  const fileConfig = await load();

  const { hint, bail, target, config, command, actions } = interpret(inputs, fileConfig);

  if (bail) return;
  if (command) return command(spinner, inputs);
  if (actions) await sequence(actions, [spinner, hint, target, config]);
})();
