'use strict';

const dc  = require('diacritics');

const cfg = require('../config');

const ranges = [
  '\ud83c[\udf00-\udfff]',
  '\ud83d[\udc00-\ude4f]',
  '\ud83d[\ude80-\udeff]'
];
const validatorErrors = [
  'User is not referencing the bot in the message',
  'User\'s sentence is empty',
  'The background icon token is not a supported emoji',
  'The foreground icon token is not a supported emoji',
  'The background and foreground icons shall not be the same'
]

function standardiseMessage(msg) {
  return dc.remove(msg).trim().replace(/[\t ]+/g, ' ');
}

function tokenize(text) {
  return text.split(' ');
}

function isEmoji(str) {
  return !!str.match(ranges.join('|'));
}

class Command {
  constructor(refId, sentence, backgroundIcon, fontIcon) {
    this.refId = refId;
    this.sentence = sentence;
    this.backgroundIcon = backgroundIcon || cfg.defaultBackground;
    this.fontIcon = fontIcon || cfg.defaultFont;
  }

  isValid(botId) {
    const validations = [
      botId === this.refId,
      !!this.sentence,
      isEmoji(this.backgroundIcon),
      isEmoji(this.fontIcon),
      this.backgroundIcon !== this.fontIcon
    ];

    const errors = [];
    for (let i = 0; i < validations.length; ++i)
      if (!validations[i])
        errors.push(validatorErrors[i]);

    return { reply: validations[0], errors }
  }

  set refId(value) {
    this._refId = value.replace(/[<@>]/g, '');
  }

  get refId() {
    return this._refId;
  }
}

class CommandInterpreter {
  constructor(botId) {
    this.id = botId;
  }

  structure(message) {
    const tokens = tokenize(standardiseMessage(message))
    const command = new Command(tokens[0], tokens.slice(1, -2).join(' '),
      tokens[tokens.length - 2], tokens[tokens.length - 1]);
    const errors = command.isValid(this.id);

    if (errors.errors && errors.errors.length)
      return { command, errors };
    return { command };
  }
}

module.exports = CommandInterpreter;
