const { fromSrt } = require('subtitles-parser');

async function srt(subtitleText) {
  return fromSrt(subtitleText);
}

module.exports = srt;
