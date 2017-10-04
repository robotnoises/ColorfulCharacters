var utils = require('./utils');
require('./polyfills');

// ColorfulCharacters

function Result(str, pos, len) {
  this.str = str;
  this.pos = pos;
  this.len = len;
}

/**
 * 
 * @param {*} characterMap 
 * @param {*} options 
 */

/**
 * Example of a charactermap
 * {
     "(": "#f00",
     ")": "#f00",
     "/[a-zA-z]/": "#0f0",
     "/[*+-/]/": "#00f"
   }
 */

function ColorfulCharacters(characterMap, options) {
  this._characterMap = characterMap;
  this._resultMap = new Map();
  this._options = {
    changeColor: options ? options.changeColor : true,
    changeBackground: options ? options.changeBackground : false
  };
  this._hasRegex = Object.keys(characterMap).some(function (key) {
    return utils.isRegex(key);
  });
}

ColorfulCharacters.prototype.render = function (input) {
  var that = this;
  var stringToRender = input;
  var buffer = [];
  var skips = {};

  if (!input || typeof input !== 'string') {
    throw new Error('input must be a string');
  }

  // First, sweep the input for any regex matches
  if (that._hasRegex) {
    var firstPass = input;

    Object.keys(that._characterMap).filter(function (key) {
      return utils.isRegex(key);
    })
      .forEach(function (key) {
        var strippedRegex = key.substr(1, (key.length - 2));
        var re = new RegExp(strippedRegex, 'gi');

        firstPass.replace(re, function (match, offset, str) {
          buffer.push(new Result(utils.colorize(match, that._characterMap[key], that._options), offset, match.length));
          skips[offset] = true;
          return;
        });
      });
  }
  
  // Process the remaining characters that haven't been captured by regex
  stringToRender.split('').forEach(function (char, index) {
    if (!skips[index] && that._characterMap[char]) {
      buffer.push(new Result(utils.colorize(char, that._characterMap[char], that._options), index, 1));
    }
  });

  buffer.sort(function (a, b) {
    return b.pos - a.pos;
  })
  .forEach(function (item) {
    input = input.replaceAt(item.pos, item.len, item.str);
  });

  return input;
};

window.ColorfulCharacters = ColorfulCharacters;