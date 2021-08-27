const path = require('path');
const chalk = require('chalk');
const Fuse = require('fuse.js');

const Flags = {
  advisories: ['--advisories', '-a'],
  backup: ['--backup', '-b'],
  clean: ['--clean', '-c'],
  directory: ['--directory', '-d'],
  help: ['--help', '-h'],
  install: ['--install', '-i'],
  protect: ['--protect', '-p'],
  scan: ['--scan', '-s'],
  upgrade: ['--upgrade', '-u']
};

const { editConfig } = require('./config');
const { clean, test, scan, backup, restore, install, upgrade } = require('./compilers');
const { help, protect, report, backups, advisories, configuration } = require('./handlers');

const controller = (inputs, { frozen, ...config }) => {
  let dir;
  let error;
  let index;
  let special;
  let handler;
  let compiler;
  let hint = '';
  const teardown = [];
  const preparatory = [];
  let target = process.cwd();

  if (!test('-e', path.join(target, 'package.json')))
    error = 'failed to locate a package.json file' + hint || chalk.gray(`in ${target}`);

  if (inputs[0] === 'help') special = help;
  else if (inputs[0] === 'set') special = editConfig;
  else if (inputs[0] === 'config') special = configuration;
  else if (Flags.backup.includes(inputs[0]) && inputs[1] === 'list') special = backups;

  !special &&
    inputs.forEach((input, i) => {
      if (error || index === i) return;

      if (Flags.directory.includes(input)) {
        index = i + 1;
        dir = inputs[index];
        target = dir;
        hint = chalk.gray(` in ${target}`);
      } else if (Flags.clean.includes(input))
        compiler ? teardown.push(clean) : preparatory.push(clean);
      else if (Flags.backup.includes(input))
        if (inputs[i + 1] === 'restore') {
          index = i + 1;
          compiler ? teardown.push(restore) : preparatory.push(restore);
        } else if (inputs[i + 1] === 'list') {
          index = i + 1;
          compiler ? teardown.push(backups) : preparatory.push(backups);
        } else compiler ? teardown.push(backup) : preparatory.push(backup);
      else if (Flags.install.includes(input))
        if (frozen) error = '--install is not allowed when frozen is set to true';
        else compiler ? teardown.push(install) : preparatory.push(install);
      else if (Flags.upgrade.includes(input))
        if (frozen) error = '--upgrade is not allowed when frozen is set to true';
        else compiler ? teardown.push(upgrade) : preparatory.push(upgrade);
      else if (Flags.scan.includes(input)) {
        compiler = scan;
        handler = report;
      } else if (Flags.protect.includes(input)) {
        compiler = scan;
        handler = protect;
      } else if (Flags.advisories.includes(input)) {
        compiler = scan;
        handler = advisories;
      } else {
        const fuzzy = new Fuse(
          Object.values(Flags)
            .flat(2)
            .filter(data => data.length > 2),
          { threshold: 0.4 }
        ).search(input);

        let suggestions = '\n';

        // eslint-disable-next-line no-extra-parens
        fuzzy.forEach(suggestion => {
          suggestions += `\n${chalk.gray(
            `${inputs.join().replace(',', ' ').replace(input, chalk.white(suggestion.item))}`
          )}`;
        });

        error =
          'invalid flag ' +
          chalk.red(`${input}`) +
          (fuzzy.length > 0 ? ', did you mean to use?' + `${suggestions}` : '');
      }
    });

  !error && config.backup && preparatory.unshift(backup);

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
