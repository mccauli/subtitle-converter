const path = require('path');
// const dfxp = require('./dfxp');
// const scc = require('./scc');
const srt = require('./srt');
// const ttml = require('./ttml');
// const vtt = require('./vtt');
const standardize = require('../transformers/standardize');
const convertTextEncoding = require('../transformers/text_encoding_converter');

async function getRawData(subtitleFile) {
  const subExt = path.extname(subtitleFile);

  switch (subExt) {
    case '.srt':
      return srt(subtitleFile);
    default:
      throw new Error(`Filetype ${subExt} is not supported.`);
  }
}

async function parse(subtitleFile) {
  // TODO refactor text encoding converter, don't replace the original file
  // attempt to detect and convert text encoding to utf8
  await convertTextEncoding(subtitleFile).catch(err => { throw Error(err); });

  const rawData = await getRawData(subtitleFile);

  return standardize(rawData);
}

parse('/Users/ian/Downloads/fixed_all.srt')
  .then(res => console.log(res))
  .catch(err => console.log(err));

module.exports = parse;
