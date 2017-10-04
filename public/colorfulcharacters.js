(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./polyfills":2,"./utils":3}],2:[function(require,module,exports){
module.exports = (function () {
  // Pollyfills

  // Production steps of ECMA-262, Edition 5, 15.4.4.17
  // Reference: http://es5.github.io/#x15.4.4.17
  if (!Array.prototype.some) {
    Array.prototype.some = function (fun/*, thisArg*/) {
      'use strict';

      if (this == null) {
        throw new TypeError('Array.prototype.some called on null or undefined');
      }

      if (typeof fun !== 'function') {
        throw new TypeError();
      }

      var t = Object(this);
      var len = t.length >>> 0;

      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t && fun.call(thisArg, t[i], i, t)) {
          return true;
        }
      }

      return false;
    };
  }

  // Production steps of ECMA-262, Edition 5, 15.4.4.18
  // Reference: http://es5.github.io/#x15.4.4.18
  if (!Array.prototype.forEach) {

    Array.prototype.forEach = function (callback/*, thisArg*/) {

      var T, k;

      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      // 1. Let O be the result of calling toObject() passing the
      // |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get() internal
      // method of O with the argument "length".
      // 3. Let len be toUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If isCallable(callback) is false, throw a TypeError exception. 
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      // 5. If thisArg was supplied, let T be thisArg; else let
      // T be undefined.
      if (arguments.length > 1) {
        T = arguments[1];
      }

      // 6. Let k be 0.
      k = 0;

      // 7. Repeat while k < len.
      while (k < len) {

        var kValue;

        // a. Let Pk be ToString(k).
        //    This is implicit for LHS operands of the in operator.
        // b. Let kPresent be the result of calling the HasProperty
        //    internal method of O with argument Pk.
        //    This step can be combined with c.
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal
          // method of O with argument Pk.
          kValue = O[k];

          // ii. Call the Call internal method of callback with T as
          // the this value and argument list containing kValue, k, and O.
          callback.call(T, kValue, k, O);
        }
        // d. Increase k by 1.
        k++;
      }
      // 8. return undefined.
    };
  }

  if (!String.prototype.replaceAt) {
    String.prototype.replaceAt = function (index, length, replacement) {
      return this.substr(0, index) + replacement + this.substr(index + length);
    }
  }
})();
},{}],3:[function(require,module,exports){
// Utils

/**
 * hex2rgb()
 *
 * @param {*} hex
 * 
 * @return '255, 255, 255'
 */
function hex2rgb(hex) {
  var isShorthand = false;
  var buffer = ''; // can buffer up to 1 char

  if (!hex || typeof hex !== 'string' || hex.indexOf('#') !== 0 || (hex.length !== 4 && hex.length !== 7)) {
    throw new Error('hex value must be formatted like "#fff" or "#ffffff"');
  }

  isShorthand = hex.length === 4;

  return hex.split('').reduce(function (acc, val) {
    if (val === '#') {
      return acc;
    } else if (isShorthand) {
      acc.push(parseInt((val + val), 16));
      acc.push(',');
    } else {
      if (buffer) {
        acc.push(parseInt((buffer + val), 16));
        acc.push(',');
        buffer = '';
      } else {
        buffer = val;
      }
    }

    return acc;
  }, []).join('');
}

/**
 * isRegex()
 *
 * @param {string} input 
 * 
 * Testing to see if it's in this format /foo/
 */
function isRegex(input) {
  return input && input.length >= 3 && input.indexOf('/') === 0 && input.split('').pop() === '/';
}

function hasRegex(characterMap) {
  return Object.keys(characterMap).some(function (key) {
    return isRegex(key);
  });
}

/**
 * colorize()
 *
 * @param {*} character 
 * @param {*} color 
 */
function colorize(character, color, options) {
  if (!character || !color) {
    return character || '';
  }

  var colorStyle = options.changeColor ? color + ';' : '';
  var backgroundStyle = options.changeBackground ? 'rgba(' + hex2rgb(color) + '0.05);' : '';

  return '<span style="color: ' + colorStyle + 'background: ' + backgroundStyle + '">' + character + '</span>';
}

/**
 * getOptions()
 *
 * @param {object} options
 * 
 * Get options w/defaults for ColorfulCharacters object
 */
function getOptions(options) {
  return {
    changeColor: options ? options.changeColor : true,
    changeBackground: options ? options.changeBackground : false
  };
}

module.exports = {
  hex2rgb: hex2rgb,
  isRegex: isRegex,
  hasRegex: hasRegex,
  colorize: colorize,
  getOptions: getOptions,
};

},{}]},{},[1]);
