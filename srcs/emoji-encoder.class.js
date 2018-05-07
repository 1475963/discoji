// This module contains a class to encode a sentence to an emoji sequence
'use strict';

const fs  = require('fs');
const path  = require('path');

const characterHeight = 7;
const errCharUnavailable = function (char) {
  return 'Character "' + char + '" not available :kissing:';
};

function loadCharacterMap (character, mapping) {
  let charMap = fs.readFileSync(path.join('data', character), 'utf8');
  let refinedCharMap = [''];
  let row = 0;

  for (let charIndex in charMap) {
    let char = charMap[charIndex];

    if (mapping.hasOwnProperty(char)) {
      refinedCharMap[row] += mapping[char];
    }
    else if (char === '\n') {
      refinedCharMap.push('');
      row += 1;
    }
  }

  return refinedCharMap;
}

function buildOutput(map, sentence) {
  let answer = [];
  let part = 0;

  for (let charIndex in sentence) {
    let char = sentence[charIndex];
    let letter = '';

    for (let i = 0; i < characterHeight; i++) {
      console.log('char:', map[charIndex][i]);
      letter += map[charIndex][i] + '\n';
    }

    console.log('letter:', letter)

    answer.push(letter);
    part += 1;
  }

  console.log('answer:', answer);

  return answer;
}

class EmojiEncoder {
  constructor(backgroundIcon, fontIcon) {
    this.backgroundPlaceholder = 'o';
    this.fontPlaceholder = 'x';
    this.mapping = {
      [ this.backgroundPlaceholder ]: backgroundIcon,
      [ this.fontPlaceholder ]: fontIcon
    };
    this.authorizedChars = fs.readdirSync(path.join('data')).map(char => char === 'empty' ? ' ' : char);
    this.encodedChars = this.authorizedChars.reduce((storage, char) => {
      storage[char] = loadCharacterMap(char === ' ' ? 'empty' : char, this.mapping);
      return storage;
    }, {});
    /*
    console.log('authorizedChars:', this.authorizedChars);
    console.log('encoded:', this.encodedChars);
    */
  }

  encode(sentence) {
    // transform chars to map of emojis
    const map = [];
    for (let charIndex in sentence) {
      let char = sentence[charIndex];

      if (!this.encodedChars.hasOwnProperty(char)) {
        return errCharUnavailable(char);
      }
      map.push(this.encodedChars[char]);
    }

    return buildOutput(map, sentence);
  }
}

module.exports = EmojiEncoder;
