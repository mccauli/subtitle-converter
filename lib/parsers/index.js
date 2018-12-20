const path = require('path');
const dfxp = require('./dfxp');
const scc = require('./scc');
const srt = require('./srt');
const ttml = require('./ttml');
const vtt = require('./vtt');
const standardize = require('../transformers/standardize');
const readFile = require('../transformers/file_to_string');

async function stringToJson(subtitleText, fileExtension) {
  switch (fileExtension) {
    case '.dfxp':
      return dfxp(subtitleText);
    case '.scc':
      return scc(subtitleText);
    case '.srt':
      return srt(subtitleText);
    case '.ttml':
      return ttml(subtitleText);
    case '.vtt':
      return vtt(subtitleText);
    default:
      throw new Error(`Filetype ${fileExtension} is not supported.`);
  }
}

async function parse(subtitleFile) {
  const fileExtension = path.extname(subtitleFile);
  try {
    const subtitleText = await readFile(subtitleFile);
    const jsonData = await stringToJson(subtitleText, fileExtension);

    return standardize(jsonData);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = parse;
