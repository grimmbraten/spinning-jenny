const ora = require('ora');
const { scan } = require('../../src/functions');

const target = `${__dirname}/../project/`;

const config = {
  label: false,
  backup: false,
  frozen: false,
  verbose: false,
  pattern: '--caret'
};

describe('scan()', () => {
  it('find expected vulnerabilities in listed depedencies', async () => {
    const response = await scan(ora(), '', target, config);
    expect(response).toEqual('detected 339 vulnerabilities');
  }, 15000);
});
