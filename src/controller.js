const path = require('path');
const chalk = require('chalk');
const Fuse = require('fuse.js');

const Flags = {
  audit: ['--audit', '-a'],
  backup: ['--backup', '-b'],
  clean: ['--clean', '-c'],
  dir: ['--directory', '-d'],
  help: ['--help', '-h'],
  install: ['--install', '-i'],
  options: ['--options', '-o'],
  patches: ['--patches', '-p'],
  resolve: ['--resolve', '-r'],
  upgrade: ['--upgrade', '-u']
};

const { dry, test, audit, backup, original, install, upgrade } = require('./compilers');
const { help, resolve, report, backups, patches, configuration } = require('./handlers');

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
    error = 'could not find a package.json file' + hint || chalk.gray(`in ${target}`);

  if (Flags.options.includes(inputs[0])) special = configuration;
  else if (Flags.backup.includes(inputs[0]) && inputs[1] === 'list') special = backups;
  else if (Flags.help.includes(inputs[0])) special = help;

  !special &&
    inputs.forEach((input, i) => {
      if (index === i) return;

      if (Flags.dir.includes(input)) {
        index = i + 1;
        dir = inputs[index];
        target = dir;
        hint = chalk.gray(` in ${target}`);
      } else if (Flags.clean.includes(input)) compiler ? teardown.push(dry) : preparatory.push(dry);
      else if (Flags.backup.includes(input))
        if (inputs[i + 1] === 'apply') {
          index = i + 1;
          compiler ? teardown.push(original) : preparatory.push(original);
        } else compiler ? teardown.push(backup) : preparatory.push(backup);
      else if (Flags.install.includes(input))
        if (frozen) error = '--install is not allowed when frozen is set to true';
        else compiler ? teardown.push(install) : preparatory.push(install);
      else if (Flags.upgrade.includes(input))
        if (frozen) error = '--upgrade is not allowed when frozen is set to true';
        else compiler ? teardown.push(upgrade) : preparatory.push(upgrade);
      else if (Flags.audit.includes(input)) {
        compiler = audit;
        handler = report;
      } else if (Flags.resolve.includes(input)) {
        compiler = audit;
        handler = resolve;
      } else if (Flags.patches.includes(input)) {
        compiler = audit;
        handler = patches;
      } else {
        const fuzzy = new Fuse(
          Object.values(Flags)
            .flat(2)
            .filter(data => data.length > 2),
          { threshold: 0.4 }
        ).search(input);

        let suggestions = '\n';

        // eslint-disable-next-line no-extra-parens
        fuzzy.forEach(suggestion => (suggestions += chalk.gray(`\n${suggestion.item}`)));

        error =
          'invalid flag ' +
          chalk.red(`${input}`) +
          (fuzzy.length > 0 ? ', did you mean to use?' + `${suggestions}` : '');
      }
    });

  !error && config.backup && preparatory.push(backup);

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
