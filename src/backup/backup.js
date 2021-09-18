const chalk = require('chalk');
const { read } = require('../common');

const backup = async (spinner, inputs) => {
  const project = inputs[2];
  const backups = await read(__dirname, '.resolutions.json');

  if (project) {
    const backup = Object.keys(backups).find(key => key === project);

    if (backup) {
      console.log();
      console.log(backups[backup].resolutions);
    } else spinner.fail('backup does not exist');
  } else
    Object.keys(backups).forEach(key => {
      console.log(
        `\n${key} ${chalk.gray(
          `${Object.entries(backups[key].resolutions).length} resolutions`
        )}\n${chalk.gray(backups[key].date)}`
      );
    });
};

module.exports = {
  backup
};
