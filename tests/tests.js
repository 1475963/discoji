'use strict';

//const { expect }    = require('chai');
const discoji = require('../src/discoji');

const sentence = process.argv[2] || 'NOOB';
const backgroundIcon = process.argv[3] || ':chanto:';
const fontIcon = process.argv[4] || ':sard:';
const debug = process.argv[5] === "true" ? true : false;

let output = discoji.discojeez(sentence, backgroundIcon, fontIcon, debug);

console.log("discoji output: ", output);
