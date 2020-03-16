const fs = require('fs');
const goodSRT = require('../tests/mocks/goodSRT');
const goodVTT = require('../tests/mocks/goodVTT');
const goodSCC = require('../tests/mocks/goodSCC');
const goodTTML = require('../tests/mocks/goodTTML');

const { REGEX_CONSTANTS } = require('../shared/constants');

const regexArray = [
  REGEX_CONSTANTS.srt,
  REGEX_CONSTANTS.vtt,
  REGEX_CONSTANTS.scc,
  REGEX_CONSTANTS.ttml,
];

const srtFilepath = 'tmp/s.srt';
const sccFilepath = 'tmp/s.scc';
const dfxpFilepath = 'tmp/s.dfxp';
const vttFilepath = 'tmp/s.vtt';
const srtSub = fs.readFileSync(srtFilepath, 'utf-8');
const sccSub = fs.readFileSync(sccFilepath, 'utf-8');
const dfxpSub = fs.readFileSync(dfxpFilepath, 'utf-8');
const vttSub = fs.readFileSync(vttFilepath, 'utf-8');

const SubtitleArray = [srtSub, goodSRT, dfxpSub, goodTTML, vttSub, goodVTT, goodSCC, sccSub];

function subtitleFormatExtract(subtitle) {
  let extension = 'unknown';

  regexArray.some(regex => {
    if (regex.regex.test(subtitle)) extension = regex.extension;
    return extension !== 'unknown';
  });
  return extension;
}

SubtitleArray.forEach(subtitle => {
  console.log(subtitleFormatExtract(subtitle));
});
