require('./polyfills');
var utils = require('./utils');

/**
 * Result()
 *
 * @param {string} str 
 * @param {number} pos 
 * @param {number} len
 * 
 * Represents a matched string, to be used later
 * to reconstruct the string
 */
function Result(str, pos, len) {
  this.str = str;
  this.pos = pos;
  this.len = len;
}

/**
 * ColorfulCharacters()
 *
 * @param {object} characterMap
 * @param {object} options
 *
 * The main ColorfulCharacters object
 *  
 * Example of a charactermap:
 * {
 *   "_": "#f00abc",
 *   "/[a-zA-z]/": "#0f0",
 *   "/[*+-/]/": "#00f"
 * }
*/

function ColorfulCharacters(characterMap, options) {
  this._characterMap = characterMap;
  this._options = utils.getOptions(options);
  this._hasRegex = utils.hasRegex(characterMap);
}

ColorfulCharacters.prototype.render = function (input) {
  var that = this;
  var buffer = [];
  var skips = {};

  if (!input || typeof input !== 'string') {
    throw new Error('input must be a string');
  }

  // First, sweep the input for any regex matches
  if (that._hasRegex) {
    Object.keys(that._characterMap)
      .filter(utils.isRegex)
      .forEach(function (key) {
          var strippedRegex = key.substr(1, (key.length - 2));
          var re = new RegExp(strippedRegex, 'gi');

          input.replace(re, function (match, offset, str) {
            buffer.push(new Result(utils.colorize(match, that._characterMap[key], that._options), offset, match.length));
            skips[offset] = true;
            return;
          });
        });
  }

  // Process the remaining characters that haven't been captured by regex
  input.split('').forEach(function (char, index) {
    if (!skips[index] && that._characterMap[char]) {
      buffer.push(new Result(utils.colorize(char, that._characterMap[char], that._options), index, 1));
    }
  });

  // Reverse the buffer of changes to make to the original input. It's important
  // to do this in reverse as to not impact the offset of where we need to re-insert
  // the new strings.
  buffer.sort(function (a, b) {
    return b.pos - a.pos;
  })
  .forEach(function (item) {
    // Replace the old string with the new colorized version
    input = input.replaceAt(item.pos, item.len, item.str);
  });

  return input;
};

window.ColorfulCharacters = ColorfulCharacters;