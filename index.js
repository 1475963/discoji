'use strict';

if (!process.env.TOKEN) {
  console.error('You shall define the environment variable `TOKEN`,'
    + ' you can retrieve it on the discord page of your bot');
  process.exit(1);
}

const Bot = require('./srcs/bot.class');

const bot = new Bot(process.env.TOKEN);

bot.start()
  .then(() => {
    console.log('The bot started successfully, he\'s currently listening for commands');
  })
  .catch(err => {
    console.error('An error happened during the bot\'s flow');
    console.error(err);
  });
