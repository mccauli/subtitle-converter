const { parse } = require('node-webvtt');

async function vtt(subtitleText) {
  return parse(subtitleText);
}

module.exports = vtt;
