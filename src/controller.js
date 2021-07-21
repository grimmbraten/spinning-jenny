const Flags = {
  dry: ["--dry", "-d"],
  path: ["--path", "-p"],
  twist: ["--twist", "-t"],
  audit: ["--audit", "-a"],
  revert: ["--revert", "-r"],
  upgrade: ["--upgrade", "-u"],
  install: ["--install", "-i"]
};

const { twist, report } = require("./handlers");
const { dry, revert, test, audit, upgrade, install } = require("./compilers");

const controller = (inputs, { frozen }) => {
  let error;
  let index;
  let target;
  let handler;
  let compiler;
  let hint = "";
  let teardown = [];
  let preparatory = [];

  inputs.forEach((input, i) => {
    if (!target && index !== i) {
      if (Flags.path.includes(input)) {
        index = i + 1;
        const path = inputs[index];

        if (path) {
          if (test("-e", path)) {
            target = path;
            hint = ` in ${target}`.gray;
          } else error = `"${path}" is not a valid path`;
        } else error = "please provide a path after passed flag";
      }
    }

    if (!compiler) {
      if (Flags.dry.includes(input)) preparatory.push(dry);
      else if (Flags.revert.includes(input)) preparatory.push(revert);
      else if (Flags.install.includes(input)) {
        if (frozen)
          return console.log(
            "--install is not allowed if frozen is set to true"
          );
        preparatory.push(install);
      } else if (Flags.upgrade.includes(input)) {
        if (frozen)
          return console.log(
            "--upgrade is not allowed if frozen is set to true"
          );
        preparatory.push(upgrade);
      }

      if (Flags.audit.includes(input)) {
        compiler = audit;
        handler = report;
      } else if (Flags.twist.includes(input)) {
        compiler = audit;
        handler = twist;
      }
    } else {
      if (Flags.dry.includes(input)) teardown.push(dry);
      else if (Flags.revert.includes(input)) teardown.push(revert);
      else if (Flags.install.includes(input)) {
        if (frozen)
          return console.log(
            "--install is not allowed if frozen is set to true"
          );
        teardown.push(install);
      } else if (Flags.upgrade.includes(input)) {
        if (frozen)
          return console.log(
            "--upgrade is not allowed if frozen is set to true"
          );
        teardown.push(upgrade);
      }
    }
  });

  return {
    hint,
    compiler,
    handler,
    target: target || process.cwd(),
    preparatory,
    teardown,
    error
  };
};

module.exports = {
  controller
};
