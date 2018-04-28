'use strict';

const dc  = require('diacritics');

const cfg = require('../config');

const ranges = [
  '\ud83c[\udf00-\udfff]',
  '\ud83d[\udc00-\ude4f]',
  '\ud83d[\ude80-\udeff]'
];

function standardiseMessage(msg) {
  return dc.remove(msg).trim().replace(/[\t ]+/g, ' ');
}

function tokenize(msg) {
  const tokens = msg.split(' ');
  return [ tokens[0].replace(/[<@>]/g, ''), tokens.slice(1) ];
}

function isEmoji(str) {
  if (str.match(ranges.join('|'))) {
    return true;
  }
  return false;
}

class Command {
  constructor(userId, msg) {
    /*
    if (!msg.startsWith(cfg.botPrefix))
      throw new Error(`Your message should be prefixed with ${cfg.botPrefix}`);
    */
    this.userId = userId;
    this.message = msg;
    this.sentence = '';
    console.log('tokens:', this.tokens);
    this.backgroundIcon = cfg.defaultBackground;
    this.fontIcon = cfg.defaultFont;
  }

  isValid() {
    return this.userId === this.prefix && this.tokens.length;
  }

  structure() {
    let emojiCount = 0;
    const emojiOrder = [ 'backgroundIcon', 'fontIcon' ];

    for (const token of this.tokens) {
      console.log('token:', token);
      if (!isEmoji(token) && !token.startsWith('<')) {

        if (this.sentence && this.sentence.length)
          this.sentence += ' ';
        this.sentence += token;
      }
      else if (emojiCount < 2) {
        console.log('emoji structure');
        console.log('emoji count:', emojiCount);
        console.log('index:', emojiOrder[emojiCount]);
        this[emojiOrder[emojiCount++]] = token;
      }
    }

    if (this.backgroundIcon === this.fontIcon)
      throw new Error(
        'No way, you are going nowhere with this combination of emojis');
  }

  set message(value) {
    this._message = standardiseMessage(value);
    [ this.prefix, this.tokens ] = tokenize(this.message);
  }

  get message() {
    return this._message;
  }
}

module.exports = Command;
