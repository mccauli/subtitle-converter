const dfxp = require('./dfxp');
const scc = require('./scc');
const srt = require('./srt');
const ttml = require('./ttml');
const vtt = require('./vtt');

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
      throw Error(`File type ${fileExtension} is not supported. Supported input file types include:\n`
      + 'dfxp, scc, srt, ttml, and vtt');
  }
}

async function parse(subtitleText, inputExtension, options) {
  try {
    return stringToJson(subtitleText, inputExtension, options);
  } catch (error) {
    throw Error(error);
  }
}

module.exports = parse;
