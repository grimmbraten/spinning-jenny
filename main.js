#!/usr/bin/env node

require("colors");
const ora = require("ora");
const { test, audit } = require("./shell");
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

      if (!test("-e", path)) {
        error = true;
        return spinner.fail("invalid path provided");
      }

      target = path;
    }
  }

  if (!callback) {
    if (Flags.audit.includes(input)) {
      callback = summary;
    } else if (Flags.fix.includes(input)) {
      callback = fix;
    } else if (Flags.upgrade.includes(input)) {
      //TODO assign callback
    }
  }
});

if (error) return;

const inDir = target ? ` in (${target})`.gray : "";
spinner.text = "scanning package.json file" + inDir;

if (callback) audit(callback, spinner, target, "--json");
