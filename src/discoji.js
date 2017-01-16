'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const backgroundPlaceholder = 'o';
const fontPlaceholder = 'x';
var debug = false;
const authorizedChars = fs.readdirSync('./data/');
const maxLength = 2000;
const characterHeight = 7;
const characterWidth = 7;
const charsPerFrame = 4;
const frequency = 5;
authorizedChars.push(' ');

var backgroundIcon = ':joy:';
var fontIcon = ':thumbsup:'

function loadCharacterMap (character, mapping) {
  let charMap = fs.readFileSync('./data/' + character, 'utf8');
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
      letter += map[charIndex][i] + '\n';
    }

    answer.push(letter);
    part += 1;
  }

  return answer;
}

function discojeez (sentence, backgroundIcon, fontIcon, enableDebug=false) {
  debug = enableDebug;
  sentence = sentence.toLowerCase();
  var charRepr = {};
  const mapping = {
    [backgroundPlaceholder]: backgroundIcon,
    [fontPlaceholder]: fontIcon
  }
  let map = [];

  // load all char-emoji data once
  for (let index in authorizedChars) {
    let authorizedChar = authorizedChars[index];

    if (!charRepr.hasOwnProperty(authorizedChar)) {
      if (authorizedChar === ' ') {
        charRepr[authorizedChar] = loadCharacterMap('empty', mapping);
      }
      else {
        charRepr[authorizedChar] = loadCharacterMap(authorizedChar, mapping);
      }
    }
  }

  // transform chars to map of emojis
  for (let charIndex in sentence) {
    let char = sentence[charIndex];

    if (!charRepr.hasOwnProperty(char)) {
      return errCharUnavailable(char);
    }
    map.push(charRepr[char]);
  }

  return buildOutput(map, sentence);
}

/**
 *  Discord bot integration below
 */
const botPrefix = '!discoji';
const errMsg = 'NOPE :tired_face:';
const errCharUnavailable = function (char) {
  return 'Character \"' + char + '\" not available :kissing:';
}

function isEmoji (str) {
  let ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]'
  ];
  if (str.match(ranges.join('|'))) {
    return true;
  }
  return false;
}

function parseContent (content) {
  let result = {
    sentence: '',
    backgroundIcon: backgroundIcon,
    fontIcon: fontIcon
  }

  let emojiCount = 0;
  let emojiOrder = ['backgroundIcon', 'fontIcon'];

  console.log("content: ", content);

  for (let index in content) {
    let word = content[index];

    if (!isEmoji(word) && !word.startsWith('<')) {
      if (result.sentence.length > 0) {
        result.sentence += ' ';
      }
      result.sentence += word;
    }
    else if (emojiCount < 2) {
      result[emojiOrder[emojiCount]] = word;
      emojiCount += 1;
    }
  }

  return result;
}

function formatFrame (frame) {
  let reply = '';

  for (let i = 0; i < characterHeight; i++) {
    for (let letterIndex in frame) {
      let letter = frame[letterIndex];
      let position = letter.indexOf('\n');

      if (position != -1) {
        reply += letter.substring(0, position);
        frame[letterIndex] = letter.substring(position + 1, letter.length);
        if (letterIndex == (frame.length - 1)) {
          reply += '\n';
        }
      }
    }
  }

  return reply;
}

function animate (frames, pos, msg, edit) {
  setTimeout(function() {
    if (pos >= frames.length) {
      console.log("RESET");
      pos = 0;
    }
    if (edit) {
      msg.edit('\n' + formatFrame(frames.slice(pos, pos + charsPerFrame)))
      .then(function (msg) {
        animate(frames, pos + 1, msg, true);
      })
      .catch(console.error);
    }
    else {
      msg.reply('\n' + formatFrame(frames.slice(pos, pos + charsPerFrame)))
      .then(function (msg) {
        animate(frames, pos + 1, msg, true);
      })
      .catch(console.error);
    }
  }, 1000 / frequency);
}

function formatAnimation (replies) {
  let frames = [];
  let frameIndex = -1;

  for (let replyIndex in replies) {
    let reply = replies[replyIndex];

    if ((replyIndex % charsPerFrame) === 0) {
      frameIndex += 1;
      frames.push([]);
    }

    frames[frameIndex].push(reply);
  }

  return frames;
}

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content.startsWith(botPrefix)) {
    let cmd = message.content.split(' ');
    cmd = cmd.splice(1, cmd.length - 1);
    if (cmd.length > 0) {
      let content = parseContent(cmd);
      console.log("content: ", content);

      backgroundIcon = content.backgroundIcon;
      fontIcon = content.fontIcon;
      if (backgroundIcon === fontIcon) {
        message.reply('\nTu te crois malin petit con :joy:');
        return ;
      }
      console.log("sentence: ", content.sentence);
      console.log("bg: ", content.backgroundIcon);
      console.log("font :", content.fontIcon);
      let replies = discojeez(content.sentence, content.backgroundIcon, content.fontIcon, false);
      if (typeof replies !== 'object') {
        replies = [replies];
      }
//      let frames = formatAnimation(replies);
      animate(replies, 0, message, false);
    }
    else {
      message.reply(errMsg);
    }
  }
});

client.login(process.env.TOKEN);
