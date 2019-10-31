const dfxp = require('./dfxp');
const scc = require('./scc');
const srt = require('./srt');
const ttml = require('./ttml');
const vtt = require('./vtt');

function parse(subtitleText, inputExtension, options = {}) {
  switch (inputExtension) {
    case '.srt': return srt(subtitleText, options);
    case '.scc': return scc(subtitleText, options);
    case '.ttml': return ttml(subtitleText, options);
    case '.vtt': return vtt(subtitleText, options);
    case '.dfxp': return dfxp(subtitleText, options);
    default:
      throw Error(`File type ${inputExtension} is not supported. Supported input file types include:\n`
        + 'dfxp, scc, srt, ttml, and vtt');
  }
}

module.exports = parse;
