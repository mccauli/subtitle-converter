const { readFile } = require('fs-extra');
const { fromSrt } = require('subtitles-parser');

async function srt(subtitleFile) {
  const rawData = await readFile(subtitleFile, 'utf8');
  return fromSrt(rawData);
}

module.exports = srt;
