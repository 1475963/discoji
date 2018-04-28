'use strict';

const Discord = require('discord.js');

const Command = require('./command.class');
const EmojiEncoder = require('./emojiencoder.class');

const client = new Discord.Client();
var debug = false;
const maxLength = 2000;
const characterHeight = 7;
const characterWidth = 7;
const charsPerFrame = 4;
const frequency = 5;

/**
 *  Discord bot integration below
 */
const errMsg = 'NOPE :tired_face:';

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
      console.log('frames:', frames);
      msg.reply('\n' + formatFrame(frames.slice(pos, pos + charsPerFrame)))
      .then(function (msg) {
        animate(frames, pos + 1, msg, true);
      })
      .catch('reply err:', console.error);
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
  console.log('emojis:', client.emojis.array()[0]);
  console.log('id:', client.user.id);
});

client.on('message', message => {
  console.log('INCOMING MESSAGE ->', message.content);
  try {
    const cmd = new Command(client.user.id, message.content);

    if (!cmd.isValid())
      throw new Error('Your message has a wrong format');

    cmd.structure();
    console.log("sentence: ", cmd.sentence);
    console.log("bg: ", cmd.backgroundIcon);
    console.log("font: ", cmd.fontIcon);
    const encoder = new EmojiEncoder(cmd.backgroundIcon, cmd.fontIcon);
    let replies = encoder.encode(cmd.sentence);
    if (typeof replies !== 'object') {
      replies = [replies];
    }
    replies[0] = '\n' + replies[0]
    console.log('replies:');
    console.log(JSON.stringify(replies, null, 4));
    message.reply(replies)
  //      let frames = formatAnimation(replies);
  /*
    animate(replies, 0, message, false);
    */
  }
  catch (ex) {
    console.error('ex:', ex);
//    message.reply(ex.message);
  }
});

client.login(process.env.TOKEN);

//module.exports = { discojeez }
