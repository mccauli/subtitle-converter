// TODO remove this file
const path = require('path');
const convert = require('../index');

const subtitleFiles = [
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_dfxp.dfxp',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_scc.scc',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_srt.srt',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_ttml.ttml',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_vtt.vtt',
];

Promise.all(subtitleFiles.map(inputFile => convert(
  inputFile,
  `/tmp/${path.basename(inputFile, path.extname(inputFile))}.srt`,
  {
    removeTextFormatting: true,
    timecodeOverlapLimiter: 1,
    // shiftTimecode: 3,
    // sourceFps: 25,
    // outputFps: 23.976,
  },
)))
  .then(res => console.log(res))
  .catch(err => console.log(err));
