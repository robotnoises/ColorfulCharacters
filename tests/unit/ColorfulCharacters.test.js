var ColorfulCharacters = require('./../../src/index');

describe('ColorfulCharacters (main)', function () {
  describe('confirm the existence of', function () {
    var cc = new ColorfulCharacters();

    test('.colorize()', function () {
      expect(cc.colorize).toBeDefined();
    });
  });

  /**
   * .colorize();
   */

  describe('.colorize()', function () {
    var noMatchText = 'def';
    var matchText = '(a)';
    var matchTextRegex = 'z2';
    var matchSingleChar = 'b';
    var matchSingleRegex = '9';
    var errorText = 'input must be a string';

    // Test Instance
    var cc = new ColorfulCharacters({
      'a': '#000',
      'b': '#999',
      'c': '#fff',
      '/\\d/': '#f0f'
    });

    // Have to wrap the function call to trap the Error
    function colorizeWrapper(input) {
      return cc.colorize(input);
    }

    test('Bad input throws error', function () {
      expect(colorizeWrapper).toThrowError(errorText);
      expect(colorizeWrapper.bind(null)).toThrowError(errorText);
      expect(colorizeWrapper.bind(123)).toThrowError(errorText);
      expect(colorizeWrapper.bind({})).toThrowError(errorText);
      expect(colorizeWrapper.bind(true)).toThrowError(errorText);
    });
    test('"No match" just returns original input', function () {
      expect(cc.colorize(noMatchText)).toBe(noMatchText);
    });
    test('"Match text" to return with appropriate span tags', function () {
      expect(cc.colorize(matchText))
        .toBe('(<span style="color: #000;background: ">a</span>)');
    });
    test('"Match text w/Regex" to return with appropriate span tags', function () {
      expect(cc.colorize(matchTextRegex))
        .toBe('z<span style="color: #f0f;background: ">2</span>');
    });
    test('"Match single char to return with appropriate span tags', function () {
      expect(cc.colorize(matchSingleChar))
        .toBe('<span style="color: #999;background: ">b</span>');
    });
    test('"Match char w/Regex" to return with appropriate span tags', function () {
      expect(cc.colorize(matchSingleRegex))
        .toBe('<span style="color: #f0f;background: ">9</span>');
    });
  });
});
