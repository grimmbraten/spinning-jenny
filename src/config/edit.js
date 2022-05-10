const { write } = require('../services/json');

const edit = async config => {
  await write(__dirname, '.properties.json', config);
};

module.exports = {
  edit
};
