'use strict';

const discoji = require('../src/discoji');

const sentence = process.argv[2];
const backgroundIcon = process.argv[3];
const fontIcon = process.argv[4];
const debug = process.argv[5] === "true" ? true : false;

let output = discoji.discojeez(sentence, backgroundIcon, fontIcon, debug);

console.log("discoji output: ", output);
