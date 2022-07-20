const chalk = require('chalk');
const Fuse = require('fuse.js');

const {
  audit,
  restore,
  clean,
  install,
  fix,
  backup,
  advise,
  actions,
  flags
} = require('../actions');

const getActions = (inputs, config) => {
  let skipIndex;
  let hint = '';
  let bail = false;
  let target = process.cwd();

  const functions = [];

  inputs.forEach((input, index) => {
    if (bail || skipIndex >= index) return;

    if (flags.exclude.includes(input)) {
      const upComingInputs = inputs.slice(index + 1, inputs.length);
      const nextFlagIndex = upComingInputs.findIndex(val => val.includes('--'));

      config.exclude = upComingInputs.slice(
        0,
        nextFlagIndex === -1 ? inputs.length : nextFlagIndex
      );

      if (nextFlagIndex === -1) skipIndex = inputs.length;
      else skipIndex = index + nextFlagIndex;
    } else if (flags.label.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.label = inputs[skipIndex] === 'true';
      } else config.label = true;
    else if (flags.frozen.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.frozen = inputs[skipIndex] === 'true';
      } else config.frozen = true;
    else if (flags.upgrade.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.upgrade = inputs[skipIndex] === 'true';
      } else config.upgrade = true;
    else if (flags.backup.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.backup = inputs[skipIndex] === 'true';
      } else config.backup = true;
    else if (flags.directory.includes(input)) {
      skipIndex = index + 1;
      target = inputs[skipIndex];
      hint = chalk.gray(` in ${target}`);
    } else if (actions.audit.includes(input)) functions.push(audit);
    else if (actions.clean.includes(input)) functions.push(clean);
    else if (actions.advise.includes(input)) functions.push(advise);
    else if (actions.restore.includes(input)) functions.push(restore);
    else if (actions.install.includes(input)) functions.push(install);
    else if (actions.fix.includes(input)) functions.push(fix);
    else {
      bail = true;
      suggestFunction(inputs, input);
    }
  });

  functions.unshift(backup);
  config.steps.total = functions.length;

  return { hint, bail, actions: functions.length > 0 ? functions : null, target, config };
};

const suggestFunction = (inputs, input) => {
  const fuzzy = new Fuse(
    Object.values({ ...flags, ...actions })
      .flat(2)
      .filter(data => data.length > 2),
    { threshold: 0.4 }
  ).search(input);

  console.log('\ndid you mean?');

  fuzzy.forEach(suggestion =>
    console.log(`spinning-jenny ${inputs.join(' ').replace(input, chalk.green(suggestion.item))}`)
  );
};

module.exports = {
  getActions
};
