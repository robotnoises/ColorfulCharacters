var utils = require('./../../src/utils');

describe('utils', function () {
  describe('confirm the existence of all utils methods', function () {
    test('.hex2rgb() method exists', function () {
      expect(utils.hex2rgb).toBeDefined();
    });
    test('.isRegex() method exists', function () {
      expect(utils.isRegex).toBeDefined();
    });
    test('.hasRegex() method exists', function () {
      expect(utils.hasRegex).toBeDefined();
    });
    test('.colorize() method exists', function () {
      expect(utils.colorize).toBeDefined();
    });
    test('.getOptions() method exists', function () {
      expect(utils.getOptions).toBeDefined();
    });
  });

  /**
   * utils.hex2rgb()
   */

  describe('.hex2rgb()', function () {
    var err = 'hex value must be formatted like "#fff" or "#ffffff"';

    // We gotta wrap this badboy so that the error gets caught by Jest
    function wrappedHex2rgb(input) {
      return utils.hex2rgb(input);
    }

    test('undefined throws error', function () {
      expect(wrappedHex2rgb).toThrow(err);
    });
    test('bad input throws error', function () {
      expect(wrappedHex2rgb.bind(null)).toThrow(err);
      expect(wrappedHex2rgb.bind({})).toThrow(err);
      expect(wrappedHex2rgb.bind('hi')).toThrow(err);
      expect(wrappedHex2rgb.bind('')).toThrow(err);
      expect(wrappedHex2rgb.bind(123)).toThrow(err);
    });
    test('shorthand hex #fa5 returns 255,170,85,', function () {
      expect(utils.hex2rgb('#fa5')).toBe('255,170,85,');
    });
    test('long hex #ffaa55 returns 255,170,85,', function () {
      expect(utils.hex2rgb('#fa5')).toBe('255,170,85,');
    });
  });

  /**
   * utils.isRegex()
   */

  describe('.isRegex()', function () {
    test('undefined returns false', function () {
      expect(utils.isRegex()).toBe(false);
    });
    test('bad input false', function () {
      expect(utils.isRegex(666)).toBe(false);
      expect(utils.isRegex(null)).toBe(false);
      expect(utils.isRegex('a string')).toBe(false);
      expect(utils.isRegex({ a: '1' })).toBe(false);
    });
    test('regex returns true', function () {
      expect(utils.isRegex('/[\\b.*\\b]/')).toBe(true);
    });
  });

  /**
   * utils.hasRegex()
   */

  describe('.hasRegex()', function () {
    test('undefined returns false', function () {
      expect(utils.hasRegex()).toBe(false);
    });
    test('bad input returns false', function () {
      expect(utils.hasRegex('this is a string')).toBe(false);
      expect(utils.hasRegex(0)).toBe(false);
      expect(utils.hasRegex(123)).toBe(false);
    });
    test('empty object returns false', function () {
      expect(utils.hasRegex({})).toBe(false);
    });
    test('characterMap with no regex returns false', function () {
      expect(utils.hasRegex({ 'f': 'oo'})).toBe(false);
    });
    test('characterMap with 1 regex returns true', function () {
      expect(utils.hasRegex({ '/[a-zA-Z]/': '#fff' })).toBe(true);
    });
    test('characterMap with 2 regex returns true', function () {
      expect(utils.hasRegex({
        '/[a-zA-Z]/': '#fff',
        '/[0-9]/': '#f00',
      })).toBe(true);
    });
    test('characterMap with mix of regex and non-regex returns true', function () {
      expect(utils.hasRegex({
        '/[a-zA-Z]/': '#fff',
        '(': '#333333',
        '/[0-9]/': '#f00',
      })).toBe(true);
    });
  });
});
