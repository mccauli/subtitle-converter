const goodSRT = require('../tests/mocks/goodSRT');
const goodVTT = require('../tests/mocks/goodVTT');
const goodSCC = require('../tests/mocks/goodSCC');

const { REGEX_CONSTANTS } = require('../shared/constants');

const { srtRegex, vttRegex, sccRegex } = REGEX_CONSTANTS;

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
console.log(`SRT: ${subtitleFormatCheck(goodSRT, srtRegex)}`);
console.log(`VTT: ${subtitleFormatCheck(goodVTT, vttRegex)}`);
console.log(`SCC: ${subtitleFormatCheck(goodSCC, sccRegex)}`);
// console.log(`TTML: ${subtitleFormatCheck(goodVTT, vttRegex)}`);
// console.log(`DFXP: ${subtitleFormatCheck(goodVTT, vttRegex)}`);
