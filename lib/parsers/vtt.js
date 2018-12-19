const { readFile } = require('fs-extra');
const { parse } = require('node-webvtt');

async function vtt(subtitleFile) {
  const rawData = await readFile(subtitleFile, 'utf8');
  return parse(rawData.trim());
}

module.exports = vtt;
