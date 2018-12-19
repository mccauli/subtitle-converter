const path = require('path');
const dfxp = require('./dfxp');
const scc = require('./scc');
const srt = require('./srt');
const ttml = require('./ttml');
const vtt = require('./vtt');
const standardize = require('../transformers/standardize');
const convertTextEncoding = require('../transformers/text_encoding_converter');

async function getRawData(subtitleFile) {
  const subExt = path.extname(subtitleFile);

  switch (subExt) {
    case '.dfxp':
      return dfxp(subtitleFile);
    case '.scc':
      return scc(subtitleFile);
    case '.srt':
      return srt(subtitleFile);
    case '.ttml':
      return ttml(subtitleFile);
    case '.vtt':
      return vtt(subtitleFile);
    default:
      throw new Error(`Filetype ${subExt} is not supported.`);
  }
}

async function parse(subtitleFile) {
  try {
    // TODO refactor text encoding converter, don't replace the original file
    // attempt to detect and convert text encoding to utf8
    await convertTextEncoding(subtitleFile);
    const rawData = await getRawData(subtitleFile);

    return standardize(rawData);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = parse;
