// Pollyfills

// Production steps of ECMA-262, Edition 5, 15.4.4.17
// Reference: http://es5.github.io/#x15.4.4.17
if (!Array.prototype.some) {
  Array.prototype.some = function(fun/*, thisArg*/) {
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
  
    Array.prototype.forEach = function(callback/*, thisArg*/) {
  
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

// Utils

/**
 * hex2rgb()
 *
 * @param {*} hex
 * 
 * @return '255, 255, 255'
 */
function hex2rgb (hex) {
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

  return '<span style="color: ' + colorStyle + 'background: ' + backgroundStyle +'">' + character + '</span>';
}

/**
 * processCharacters()
 * 
 * @param {*} characterMap 
 * @param {*} input 
 */
function processCharacters(characterMap, input, options) {
  return input.split('').reduce(function (acc, char) {
    if (characterMap[char]) {
      acc.push(colorize(char, characterMap[char], options));
    } else {
      acc.push(char);
    }

    return acc;
  }, []).join('');
}

/**
 * processRegex()
 *
 * @param {*} characterMap 
 * @param {*} input 
 */
function processRegex(characterMap, input, options) {
  var result = input || '';

  Object.keys(characterMap).filter(function (key) {
    return isRegex(key);
  })
  .forEach(function (key) {
    var strippedRegex = key.substr(1, (key.length -2));
    var re = new RegExp(strippedRegex, 'gi');

    result = result.replace(re, function (match, offset, str) {
      return colorize(match, characterMap[key], options);
    });
  });

  return result;
}

// ColorfulCharacters

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
  this._options = {
    changeColor: options ? options.changeColor : true,
    changeBackground: options ? options.changeBackground : false
  };
  this._hasRegex = Object.keys(characterMap).some(function (key) {
    return isRegex(key);
  });
}

ColorfulCharacters.prototype.render = function (input) {
  var that = this;
  var result = '';

  if (!input || typeof input !== 'string') {
    throw new Error('input must be a string');
  }

  result = processCharacters(that._characterMap, input, that._options);
  // return that._hasRegex ? processRegex(that._characterMap, result, that._options) : result;
  return result; // we don't support regex right now.
};

window.ColorfulCharacters = ColorfulCharacters;