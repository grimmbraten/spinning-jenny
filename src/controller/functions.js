const chalk = require('chalk');
const Fuse = require('fuse.js');

const {
  restore,
  scan,
  clean,
  install,
  protect,
  backup,
  advise,
  upgrade,
  actions,
  flags
} = require('../functions');

const getFunctions = (inputs, config) => {
  let skipIndex;
  let hint = '';
  let target = process.cwd();

  const functions = [];

  inputs.forEach((input, index) => {
    if (skipIndex === index) return;

    if (flags.label.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.label = inputs[skipIndex] === 'true';
      } else config.label = true;
    else if (flags.frozen.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.frozen = inputs[skipIndex] === 'true';
      } else config.frozen = true;
    else if (flags.backup.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.backup = inputs[skipIndex] === 'true';
      } else config.backup = true;
    else if (flags.verbose.includes(input))
      if (inputs[index + 1] === 'true' || inputs[index + 1] === 'false') {
        skipIndex = index + 1;
        config.verbose = inputs[skipIndex] === 'true';
      } else config.verbose = true;
    else if (flags.directory.includes(input)) {
      skipIndex = index + 1;
      target = inputs[skipIndex];
      hint = chalk.gray(` in ${target}`);
    } else if (actions.scan.includes(input)) functions.push(scan);
    else if (actions.clean.includes(input)) functions.push(clean);
    else if (actions.advise.includes(input)) functions.push(advise);
    else if (actions.restore.includes(input)) functions.push(restore);
    else if (actions.install.includes(input)) functions.push(install);
    else if (actions.upgrade.includes(input)) functions.push(upgrade);
    else if (actions.protect.includes(input)) functions.push(protect);
    else suggestFunction(inputs, input);
  });

  if (functions.length > 0) config.backup && functions.unshift(backup);
  config.steps.total = functions.length;

  return { hint, functions: functions.length > 0 ? functions : null, target, config };
};

const suggestFunction = (inputs, input) => {
  const fuzzy = new Fuse(
    Object.values({ ...flags, ...actions })
      .flat(2)
      .filter(data => data.length > 2),
    { threshold: 0.4 }
  ).search(input);

  console.log(`\nspinning-jenny ${inputs.join(' ').replace(input, chalk.red(input))}`);

  fuzzy.forEach(suggestion =>
    console.log(`spinning-jenny ${inputs.join(' ').replace(input, chalk.green(suggestion.item))}`)
  );
};

module.exports = {
  getFunctions
};
