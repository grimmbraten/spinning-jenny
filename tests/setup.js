/*
Status codes

0 - Success
1 - Ejected with warning
2 - Ejected with error

*/

console.log = jest.fn();

jest.mock('ora', () => () => ({
  start: () => ({
    start: jest.fn(),
    fail: jest.fn(),
    warn: jest.fn(),
    succeed: jest.fn(),
    text: ''
  })
}));
