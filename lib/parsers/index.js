const path = require('path');
const dfxp = require('./dfxp');
const scc = require('./scc');
const srt = require('./srt');
const ttml = require('./ttml');
const vtt = require('./vtt');
const { readFile } = require('../shared/utils');

async function stringToJson(subtitleText, fileExtension, options) {
  switch (fileExtension) {
    case '.dfxp':
      return dfxp(subtitleText, options);
    case '.scc':
      return scc(subtitleText, options);
    case '.srt':
      return srt(subtitleText, options);
    case '.ttml':
      return ttml(subtitleText, options);
    case '.vtt':
      return vtt(subtitleText, options);
    default:
      throw Error(`Filetype ${fileExtension} is not supported.`);
  }
}

async function parse(subtitleFile, options) {
  const fileExtension = path.extname(subtitleFile);
  try {
    const subtitleText = await readFile(subtitleFile);
    return stringToJson(subtitleText, fileExtension, options);
  } catch (error) {
    throw Error(error);
  }
}

module.exports = {
  parse,
}
