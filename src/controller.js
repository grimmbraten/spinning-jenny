const path = require("path");
const chalk = require("chalk");

const Flags = {
  dry: ["--dry", "-d"],
  path: ["--path", "-p"],
  audit: ["--audit", "-a"],
  config: ["--config", "-c"],
  backups: ["--backup", "-b"],
  resolve: ["--resolve", "-r"],
  upgrade: ["--upgrade", "-u"],
  install: ["--install", "-i"],
  original: ["--original", "-o"]
};

const {
  dry,
  test,
  audit,
  backup,
  original,
  install,
  upgrade
} = require("./compilers");
const { resolve, report, backups, configuration } = require("./handlers");

const controller = (inputs, { frozen, ...config }) => {
  let dir;
  let error;
  let index;
  let special;
  let handler;
  let compiler;
  let hint = "";
  let teardown = [];
  let preparatory = [];
  let target = process.cwd();

  if (config.backup) preparatory.push(backup);

  if (Flags.config.includes(inputs[0])) special = configuration;
  else if (Flags.backups.includes(inputs[0])) special = backups;

  if (!special) {
    inputs.forEach((input, i) => {
      if (!dir && index !== i) {
        if (Flags.path.includes(input)) {
          index = i + 1;
          dir = inputs[index];
          target = dir;
          hint = chalk.gray(` in ${target}`);
        }
      }

      if (!compiler) {
        if (Flags.dry.includes(input)) preparatory.push(dry);
        else if (Flags.original.includes(input)) preparatory.push(original);
        else if (Flags.install.includes(input)) {
          if (frozen)
            error = "--install is not allowed when frozen is set to true";
          else preparatory.push(install);
        } else if (Flags.upgrade.includes(input)) {
          if (frozen)
            error = "--upgrade is not allowed when frozen is set to true";
          else preparatory.push(upgrade);
        }

        if (Flags.audit.includes(input)) {
          compiler = audit;
          handler = report;
        } else if (Flags.resolve.includes(input)) {
          compiler = audit;
          handler = resolve;
        }
      } else {
        if (Flags.dry.includes(input)) teardown.push(dry);
        else if (Flags.original.includes(input)) teardown.push(original);
        else if (Flags.install.includes(input)) {
          if (frozen)
            error = "--install is not allowed when frozen is set to true";
          else teardown.push(install);
        } else if (Flags.upgrade.includes(input)) {
          if (frozen)
            error = "--upgrade is not allowed when frozen is set to true";
          else teardown.push(upgrade);
        }
      }
    });
  }

  if (!test("-e", path.join(target, "package.json")))
    error = "could not find a package.json file" + hint;

  return {
    hint,
    error,
    target,
    special,
    handler,
    compiler,
    teardown,
    preparatory
  };
};

module.exports = {
  controller
};
