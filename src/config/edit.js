const { write } = require('../common');

const edit = async config => {
  await write(__dirname, '.properties.json', config);
};

module.exports = {
  edit
};
