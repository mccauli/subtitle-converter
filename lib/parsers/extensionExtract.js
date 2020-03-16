const fs = require('fs');
const goodSRT = require('../tests/mocks/goodSRT');
const goodVTT = require('../tests/mocks/goodVTT');
const goodSCC = require('../tests/mocks/goodSCC');
const goodDFXP = require('../tests/mocks/goodDFXP');

const { REGEX_CONSTANTS } = require('../shared/constants');

const regexArray = [
  REGEX_CONSTANTS.srtRegex,
  REGEX_CONSTANTS.vttRegex,
  REGEX_CONSTANTS.sccRegex,
  REGEX_CONSTANTS.dfxpRegex,
];

const srtFilepath = 'tmp/s.srt';
const sccFilepath = 'tmp/s.scc';
const dfxpFilepath = 'tmp/s.dfxp';
const vttFilepath = 'tmp/s.vtt';
const srtSub = fs.readFileSync(srtFilepath, 'utf-8');
const sccSub = fs.readFileSync(sccFilepath, 'utf-8');
const dfxpSub = fs.readFileSync(dfxpFilepath, 'utf-8');
const vttSub = fs.readFileSync(vttFilepath, 'utf-8');

const SubtitleArray = [srtSub, sccSub, dfxpSub, vttSub, goodSRT, goodVTT, goodSCC, goodDFXP];

function subtitleFormatExtract(subtitle) {
  // const filetype = 'unknown';

  regexArray.forEach(regex => {
    if (regex.completeFile.test(subtitle)) {
      console.log(`This is a ${regex.type} file`);
    } else if (regex.partialFile.test(subtitle)) {
      // process.stdout.write('It is partially a ' + regex.type + ' until ' + subtitle.match(regex.partialFile)[1]);
      if (regex.header.test(subtitle)) console.log(' but the header looks good');
      else console.log(' and the header is invalid');
    }
  });
}

SubtitleArray.forEach(subtitle => {
  subtitleFormatExtract(subtitle);
});

function subtitleFormatCheck(subtitle, regex) {
  if (!regex.header.test(subtitle)) return 'Invalid Header';
  if (!regex.completeFile.test(subtitle)) {
    const regexGroups = subtitle.match(regex.partialFile);
    const errorPosition = regexGroups ? regexGroups[1] : '00:00:00';
    const errorMessage = `Invalid format after ${errorPosition}`;
    return errorMessage;
  }
  return 'The file is valid';
}
console.log(`SRT: ${subtitleFormatCheck(goodSRT, REGEX_CONSTANTS.srtRegex)}`);
// console.log(`VTT: ${subtitleFormatCheck(vttSub, vttRegex)}`);
// console.log(`SCC: ${subtitleFormatCheck(sccSub, sccRegex)}`);
// console.log(`DFXP: ${subtitleFormatCheck(dfxpSub, dfxpRegex)}`);
// console.log(`TTML: ${subtitleFormatCheck(goodVTT, vttRegex)}`);
