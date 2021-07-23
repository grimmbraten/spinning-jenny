const path = require("path");

const Flags = {
  dry: ["--dry", "-d"],
  path: ["--path", "-p"],
  audit: ["--audit", "-a"],
  config: ["--config", "-c"],
  revert: ["--revert", "-r"],
  backups: ["--backup", "-b"],
  resolve: ["--resolve", "-r"],
  upgrade: ["--upgrade", "-u"],
  install: ["--install", "-i"]
};

const {
  dry,
  test,
  audit,
  backup,
  revert,
  install,
  upgrade
} = require("./compilers");
const { resolve, report, backups, configuration } = require("./handlers");

const controller = (inputs, { frozen, ...config }) => {
  let error;
  let index;
  let target;
  let special;
  let handler;
  let compiler;
  let hint = "";
  let teardown = [];
  let preparatory = [];

  if (config.backup) preparatory.push(backup);

  if (Flags.config.includes(inputs[0])) special = configuration;
  else if (Flags.backups.includes(inputs[0])) special = backups;

  if (!special) {
    inputs.forEach((input, i) => {
      if (!target && index !== i) {
        if (Flags.path.includes(input)) {
          index = i + 1;
          const dir = inputs[index];

          if (dir) {
            if (test("-e", path.join(dir, "package.json"))) {
              target = dir;
              hint = ` in ${target}`.gray;
            } else
              error =
                `path does not contain a package.json file ` + `${dir}`.gray;
          } else error = "please provide a path after the --path flag";
        }
      }

      if (!compiler) {
        if (Flags.dry.includes(input)) preparatory.push(dry);
        else if (Flags.revert.includes(input)) preparatory.push(revert);
        else if (Flags.install.includes(input)) {
          if (frozen)
            error = "--install is not allowed if frozen is set to true";
          else preparatory.push(install);
        } else if (Flags.upgrade.includes(input)) {
          if (frozen)
            error = "--upgrade is not allowed if frozen is set to true";
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
        else if (Flags.revert.includes(input)) teardown.push(revert);
        else if (Flags.install.includes(input)) {
          if (frozen)
            error = "--install is not allowed if frozen is set to true";
          else teardown.push(install);
        } else if (Flags.upgrade.includes(input)) {
          if (frozen)
            error = "--upgrade is not allowed if frozen is set to true";
          else teardown.push(upgrade);
        }
      }
    });
  }

  return {
    hint,
    error,
    special,
    handler,
    compiler,
    teardown,
    preparatory,
    target: target || process.cwd()
  };
};

module.exports = {
  controller
};
