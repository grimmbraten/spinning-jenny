const { advise } = require('../../src/functions');
const { errorDir, secureDir, config } = require('../constants');

describe('advise()', () => {
  it('skips advise if no patches are available', async () => {
    const response = await advise('', '', secureDir, config);
    expect(response).toEqual('skipped advise');
  });

  it('succeeds if one or more patches are available', async () => {
    const response = await advise('', '', errorDir, config);
    expect(response).toContain('located');
    expect(response).toContain('3');
  });
});
