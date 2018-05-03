'use strict';

const { Client } = require('discord.js');

const Command = require('./command.class');
const EmojiEncoder = require('./emojiencoder.class');

function init(done) {
  console.log('Connection established to discord, the bot is ready to roll');
  console.log('Available emojis:', this.emojis.array()[0]);
  console.log(`Current id ${this.user.id}`);
  return done();
}

function error(done, err) {
  console.error(`ERROR: ${err.message}`);
  return done(err);
}

function flow(message) {
  console.log('INCOMING MESSAGE ->', message.content);
  const command = new Command(this.user.id, message.content);

  const error = command.isValid() || command.structure();
  if (error)
    return error;
  console.log('sentence: ', command.sentence);
  console.log('bg: ', command.backgroundIcon);
  console.log('font: ', command.fontIcon);
  const encoder = new EmojiEncoder(command.backgroundIcon, command.fontIcon);
  let replies = encoder.encode(command.sentence);
  if (typeof replies !== 'object') {
    replies = [replies];
  }
  replies[0] = '\n' + replies[0];
  console.log('replies:');
  console.log(JSON.stringify(replies, null, 4));
  message.reply(replies);
  //      let frames = formatAnimation(replies);
  /*
    animate(replies, 0, message, false);
    */
}

class Bot {
  constructor(token) {
    this.token = token;
    this.discordClient = new Client();
  }

  start() {
    return new Promise((resolve, reject) => {
      this.discordClient.on('ready', () => init.bind(this.discordClient, resolve)());
      this.discordClient.on('error', err => error.bind(this.discordClient, reject)(err));
      this.discordClient.on('message', message => {
        const err = flow.bind(this.discordClient)(message);
        err && console.error(err);
      });

      this.discordClient.login(this.token);
    });
  }
}

module.exports = Bot;
