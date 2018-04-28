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
