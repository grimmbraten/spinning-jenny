const Flags = {
  dry: ["--dry", "-d"],
  path: ["--path", "-p"],
  twist: ["--twist", "-t"],
  audit: ["--audit", "-a"],
  revert: ["--revert", "-r"],
  upgrade: ["--upgrade", "-u"],
  install: ["--install", "-i"]
};

const { test, audit, upgrade, install } = require("./shell");
const { twist, summary } = require("./callback");
const { removeResolutions } = require("./helpers");

const controller = (spinner, inputs) => {
  let error;
  let index;
  let target;
  let service;
  let teardown;
  let callback;
  let preparatory;

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

    if (!preparatory) {
      if (Flags.dry.includes(input)) {
        preparatory = removeResolutions;
      }
    }

    if (!teardown) {
      if (Flags.install.includes(input)) {
        teardown = install;
      }
    }

    if (!service) {
      if (Flags.audit.includes(input)) {
        service = audit;
        callback = summary;
      } else if (Flags.twist.includes(input)) {
        service = audit;
        callback = twist;
      } else if (Flags.upgrade.includes(input)) {
        service = upgrade;
        callback = undefined;
      }
    }
  });

  return {
    service,
    callback,
    target: target || process.cwd(),
    preparatory,
    teardown,
    error
  };
};

module.exports = {
  controller
};
