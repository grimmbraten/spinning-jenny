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
  flags
} = require('../functions');

const getFunctions = inputs => {
  let skipIndex;
  let hint = '';
  let target = process.cwd();

  const functions = [];

  inputs.forEach((input, index) => {
    if (skipIndex === index) return;

    if (flags.directory.includes(input)) {
      skipIndex = index + 1;
      target = inputs[skipIndex];
      hint = chalk.gray(` in ${target}`);
    } else if (flags.backup.includes(input)) {
      if (inputs[index + 1] === 'restore') {
        skipIndex = index++;
        functions.push(restore);
      } else if (inputs[index + 1] !== 'list') {
        skipIndex = index++;
        functions.push(backup);
      }
    } else if (flags.install.includes(input)) functions.push(install);
    else if (flags.upgrade.includes(input)) functions.push(upgrade);
    else if (flags.scan.includes(input)) functions.push(scan);
    else if (flags.protect.includes(input)) functions.push(protect);
    else if (flags.advisories.includes(input)) functions.push(advise);
    else if (flags.clean.includes(input)) functions.push(clean);
    else suggestFunction(input);
  });

  return { hint, functions: functions.length > 0 ? functions : null, target };
};

const suggestFunction = input => {
  const fuzzy = new Fuse(
    Object.values(flags)
      .flat(2)
      .filter(data => data.length > 2),
    { threshold: 0.4 }
  ).search(input);

  fuzzy.forEach(suggestion => console.log(suggestion.item));
};

module.exports = {
  getFunctions
};
