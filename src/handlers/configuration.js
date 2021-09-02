const chalk = require('chalk');
const { editConfig } = require('../config');
const { colorVariable } = require('../helpers');

const configuration = async spinner => {
  const config = await editConfig(spinner);

  if (config) {
    const keys = Object.keys(config).filter(key => key !== 'steps' && key !== 'getStep');

    console.log();
    keys.forEach(key => {
      console.log(`${key}: ` + colorVariable(config[key]));
    });

    console.log(
      chalk.gray(
        '\nfor more information, please refer to the documentation\nhttps://github.com/grimmbraten/spinning-jenny#configuration'
      )
    );
  }
};

module.exports = {
  configuration
};
