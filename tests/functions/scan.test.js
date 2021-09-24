const { scan } = require('../../src/functions');

const errorDir = `${__dirname}/../project/error/`;
const secureDir = `${__dirname}/../project/secure/`;

const config = {
  label: false,
  backup: false,
  frozen: false,
  verbose: false,
  pattern: '--caret'
};

describe('scan()', () => {
  it('fails if no target dir containing a package.json is provided', async () => {
    const response = await scan('', '', '', config);
    expect(response).toEqual('failed to extract audit summary');
  });

  it('finds expected vulnerabilities in listed depedencies', async () => {
    const response = await scan('', '', errorDir, config);
    expect(response).toContain('339');
  });

  it('does not find any vulnerabilities in listed depedencies', async () => {
    const response = await scan('', '', secureDir, config);
    expect(response).toEqual('all dependencies are secure');
  });
});
