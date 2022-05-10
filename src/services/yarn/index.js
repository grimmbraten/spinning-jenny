const severities = ['critical', 'high', 'moderate', 'low', 'info'];
const { shell } = require('../shelljs');
const { findWhyTree } = require('../../helpers');

const why = async (patches, target) =>
  await Promise.all(
    patches.map(async patch => {
      const [success, response] = await shell(`yarn --cwd ${target} why ${patch.module} --json`);
      if (!success) return;
      const whyTree = findWhyTree(response);
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
  why
};
