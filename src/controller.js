const Flags = {
  dry: ["--dry", "-d"],
  path: ["--path", "-p"],
  twist: ["--twist", "-t"],
  audit: ["--audit", "-a"],
  revert: ["--revert", "-r"],
  upgrade: ["--upgrade", "-u"],
  install: ["--install", "-i"]
};

const { twist, summary } = require("./handlers");
const { dry, test, audit, upgrade, install } = require("./compilers");

const controller = inputs => {
  let error;
  let index;
  let target;
  let handler;
  let compiler;
  let teardown = [];
  let preparatory = [];

  inputs.forEach((input, i) => {
    if (!target && index !== i) {
      if (Flags.path.includes(input)) {
        index = i + 1;
        const path = inputs[index];

        if (path) {
          if (test("-e", path)) target = path;
          else error = `"${path}" is not a valid path`;
        } else error = "no path provided";
      }
    }

    if (!compiler) {
      if (Flags.dry.includes(input)) preparatory.push(dry);
      if (Flags.install.includes(input)) preparatory.push(install);
      if (Flags.upgrade.includes(input)) preparatory.push(upgrade);

      if (Flags.audit.includes(input)) {
        compiler = audit;
        handler = summary;
      } else if (Flags.twist.includes(input)) {
        compiler = audit;
        handler = twist;
      }
    } else {
      if (Flags.dry.includes(input)) teardown.push(dry);
      if (Flags.install.includes(input)) teardown.push(install);
      if (Flags.upgrade.includes(input)) teardown.push(upgrade);
    }
  });

  return {
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
