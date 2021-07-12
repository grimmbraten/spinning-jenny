#!/usr/bin/env node

require("colors");
const ora = require("ora");

const { controller } = require("./controller");

const spinner = ora("starting service").start();

const [, , ...inputs] = process.argv;

const { service, callback, target, preparatory, teardown, error } = controller(
  spinner,
  inputs
);

const hint = target !== process.cwd() ? ` in (${target})`.gray : "";

if (error) spinner.fail(error);
else if (preparatory)
  preparatory(service, spinner, hint, target, callback, teardown);
else if (service) service(spinner, hint, target, callback, teardown);
else spinner.fail("invalid command");
