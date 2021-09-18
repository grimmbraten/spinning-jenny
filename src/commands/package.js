const package = require('../../package.json');

const bin = () => console.log(package.bin);
const name = () => console.log(package.name);
const version = () => console.log(package.version);
const description = () => console.log(package.description);
const repository = () => console.log(package.repository);

module.exports = {
  bin,
  name,
  version,
  description,
  repository
};
