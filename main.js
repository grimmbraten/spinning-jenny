#!/usr/bin/env node

require("colors");
const ora = require("ora");
const { test } = require("./shell");
const { audit } = require("./audit");
const { resolve } = require("./resolve");

const Flags = {
  fix: ["--fix", "-f"],
  path: ["--path", "-p"],
  audit: ["--audit", "-a"],
  revert: ["--revert", "-r"],
  upgrade: ["--upgrade", "-u"],
  cleanup: ["--cleanup", "-c"],
  install: ["--install", "-i"]
};

const spinner = ora("starting service").start();

const [, , ...inputs] = process.argv;

let error;
let index;
let target;
let cleanup;
let install;
let service;

inputs.forEach((input, i) => {
  if (!target && index !== i) {
    if (Flags.path.includes(input)) {
      index = i + 1;
      const path = inputs[index];

      if (!test("-e", path)) {
        error = true;
        return spinner.fail("invalid path provided");
      }

      target = path;
    }
  }

  if (!cleanup) {
    if (Flags.cleanup.includes(input)) {
      cleanup = true;
    }
  }

  if (!install) {
    if (Flags.install.includes(input)) {
      install = true;
    }
  }

  if (!service) {
    if (Flags.audit.includes(input)) {
      service = audit;
    } else if (Flags.fix.includes(input)) {
      service = resolve;
    } else if (Flags.upgrade.includes(input)) {
      //callback = upgrade;
    }
  }
});

if (error) return;

const hint = target ? ` in (${target})`.gray : "";
spinner.text = "scanning package.json file" + hint;

if (service) service(spinner, target || process.cwd(), cleanup, install);
