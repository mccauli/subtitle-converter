const goodSub = require('../tests/mocks/goodSRT');
const { REGEX_CONSTANTS } = require('../shared/constants');

const { srtRegex } = REGEX_CONSTANTS;

if (!srtRegex.srtFile.test(goodSub)) {
  const regexGroups = goodSub.match(srtRegex.multiSrtBlock);
  const errorPosition = regexGroups ? regexGroups[1] : 0;
  const errorMessage = `Error at subtitle position ${errorPosition}`;
  console.log(errorMessage);
} else {
  console.log('Valid .srt file');
}
