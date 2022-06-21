const severities = ['critical', 'high', 'moderate', 'low', 'info'];
const { shell } = require('../shelljs');
const { parseWhy } = require('../../helpers');

const add = async (target, modules, dev = false) =>
  dev
    ? await shell(`yarn --cwd ${target} add ${modules.join(' ')}`)
    : await shell(`yarn --cwd ${target} add -D ${modules.join(' ')}`);

const audit = async (target, summary) =>
  summary
    ? await shell(`yarn --cwd ${target} audit --json --summary`)
    : await shell(`yarn --cwd ${target} audit --json`);

const install = async target => await shell(`yarn --cwd ${target} install`);

const why = async (patches, target) =>
  await Promise.all(
    patches.map(async patch => {
      const [success, response] = await shell(`yarn --cwd ${target} why ${patch.module} --json`);
      if (!success) return;
      const whyTree = parseWhy(response);
      return {
        ...patch,
        why: whyTree,
        order: severities.indexOf(patch.severity),
        references: patch.references.split('\n'),
        solved: patch.patchedVersions === '<0.0.0' ? 1 : 0
      };
    })
  );

module.exports = {
  add,
  why,
  audit,
  install
};
