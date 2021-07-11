#!/usr/bin/env node

const shell = require("shelljs");

require("colors");
const ora = require("ora");
const { audit } = require("./shell");
const { fix, summary } = require("./callback");

const Flags = {
  fix: ["--fix", "-f"],
  path: ["--path", "-p"],
  audit: ["--audit", "-a"],
  revert: ["--revert", "-r"],
  upgrade: ["--upgrade", "-u"]
};

const spinner = ora("starting service").start();

const [, , ...inputs] = process.argv;

let error;
let index;
let target;
let callback;

inputs.forEach((input, i) => {
  if (!target && index !== i) {
    if (Flags.path.includes(input)) {
      index = i + 1;
      const path = inputs[index];

      if (!path) {
        error = true;
        return spinner.fail("no path provided");
      }

      if (!shell.test("-e", path)) {
        error = true;
        return spinner.fail("invalid path provided");
      }

      target = path;
    }
  }

  if (!callback) {
    if (Flags.audit.includes(inputs[0])) {
      callback = summary;
    } else if (Flags.fix.includes(inputs[0])) {
      callback = fix;
    }
  }
});

if (error) return;

const test = target ? ` in (${target})`.gray : "";
spinner.text = "scanning package.json file" + test;

//if (callback) audit(callback, spinner, undefined, "--json");
