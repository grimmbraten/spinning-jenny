#!/usr/bin/env node

const ora = require("ora");
const path = require("path");
const shell = require("shelljs");
const jsonFile = require("json-file-plus");

const spinner = ora("starting service").start();

const [, , ...input] = process.argv;

const dir = process.cwd();

const fileName = path.join(dir, "package.json");

const audit = async () =>
  shell.exec(`yarn --cwd ${dir} audit --json`, {
    silent: true
  }).stdout;

const scan = async () => {
  const response = await audit();
  const json = response
    .split(/\r?\n/)
    .map(step => (step ? JSON.parse(step) : undefined))
    .filter(data => data);

  const summary = json.filter(data => data.type === "auditSummary")[0];
  const vulnerabilities = Object.values(summary.data.vulnerabilities).reduce(
    (a, b) => a + b
  );

  //const advisories = json.filter(data => data.type === "auditAdvisory");

  console.log(summary);
};

scan();

const run = async () => {
  const resolutions = json.map(({ data, type }) => {
    if (type === "auditAdvisory")
      return {
        title: data.advisory.title,
        module: data.advisory.module_name,
        version: data.advisory.vulnerable_versions,
        patched: data.advisory.patched_versions,
        severity: data.advisory.severity,
        url: data.advisory.url
      };
  });

  return resolutions;
};

const service = async () => {
  const modules = await run();

  jsonFile(fileName, async (err, file) => {
    if (err) console.error(err);

    const resolutions = await file.get("resolutions");

    const tmp = resolutions || {};

    /* console.log(tmp);
    console.log(modules); */

    modules.forEach(({ module, patched }) => {
      resolutions[module] = patched;
    });

    console.log(resolutions);

    await file.set({ resolutions });

    await file.save();
  });
};

//service();
