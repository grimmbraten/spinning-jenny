#!/usr/bin/env node

require('module-alias/register');

const { load } = require('./config');
const { sequence } = require('all-aboard');
const { interpret } = require('./controller');

const [, , ...args] = process.argv;

(async () => {
  const fileConfig = await load();
  const { hint, bail, target, config, command, actions } = interpret(args, fileConfig);
  return bail ? 1 : command ? command(args) : await sequence(actions, [hint, target, config]);
})();
