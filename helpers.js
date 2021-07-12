const path = require("path");
const package = require("json-file-plus");

const parseJson = json =>
  json
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

const removeResolutions = (
  service,
  spinner,
  hint,
  target,
  callback,
  teardown
) => {
  const name = path.join(target, "package.json");

  package(name, async (err, file) => {
    if (err) return console.error(err);

    spinner.text = "scanning for resolutions" + hint;

    const resolutions = await file.get("resolutions");

    if (!resolutions) return spinner.fail("no resolutions found");

    spinner.text = `removing resolutions` + hint;

    await file.set({ resolutions: [] });
    await file.save();

    if (!service)
      spinner.succeed(
        `removed ${Object.keys(resolutions).length} resolutions` + hint
      );
    else service(spinner, hint, target, callback, teardown);
  });
};

module.exports = {
  parseJson,
  removeResolutions
};
