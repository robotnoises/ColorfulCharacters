var utils = require('./../../src/utils');

describe('utils', function () {
  test('.hex2rgb method exists', function () {
    expect(utils.hex2rgb).toBeDefined();
  });
  test('.isRegex method exists', function () {
    expect(utils.isRegex).toBeDefined();
  });
  test('.hasRegex method exists', function () {
    expect(utils.hasRegex).toBeDefined();
  });
  test('.colorize method exists', function () {
    expect(utils.colorize).toBeDefined();
  });
  test('.getOptions method exists', function () {
    expect(utils.getOptions).toBeDefined();
  });

  describe('hasRegex', function () {
    // todo
  })
});
