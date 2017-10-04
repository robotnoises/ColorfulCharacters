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

module.exports = {
  hex2rgb: hex2rgb,
  isRegex: isRegex,
  colorize: colorize
};
