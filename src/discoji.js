'use strict';

const fs = require('fs');
const backgroundPlaceholder = 'o';
const fontPlaceholder = 'x';
var debug = false;

function loadCharacterMap (char, mapping) {
  let charMap = fs.readFileSync('./data/' + char + '.txt', 'utf8');
  let refinedCharMap = '';

  for (let charIndex in charMap) {
    let char = charMap[charIndex];

    if (mapping.hasOwnProperty(char)) {
      refinedCharMap += mapping[char];
    }
    else {
      refinedCharMap += char;
    }
  }

  return refinedCharMap;
}

exports.discojeez = function (sentence, backgroundIcon, fontIcon, enableDebug=false) {
  debug = enableDebug;
  sentence = sentence.toLowerCase();
  let mapping = {
    [backgroundPlaceholder]: backgroundIcon,
    [fontPlaceholder]: fontIcon
  }
  let map = [];
  let result = '';

  for (let charIndex in sentence) {
    let char = sentence[charIndex];

    map.push(loadCharacterMap(char, mapping));
  }

  for (let i = 0; i < 7/* placeholder for character height*/; i++) {
    for (let charIndex in sentence) {
      let char = sentence[charIndex];

      if (debug) console.log("char: ", char);
      let stopPosition = map[charIndex].indexOf("\n");
      if (debug) console.log("stopPosition: ", stopPosition);

      if (stopPosition != -1) {
        if (charIndex < sentence.length - 1) {
          if (debug) console.log("tmp: ", map[charIndex].substring(0, stopPosition));
          result += map[charIndex].substring(0, stopPosition);
        }
        else {
          if (debug) console.log("final: ", map[charIndex].substring(0, stopPosition + 1));
          result += map[charIndex].substring(0, stopPosition + 1);
        }
        map[charIndex] = map[charIndex].substring(stopPosition + 1, map[charIndex].length);
      }
    }
  }

  return result;
}
