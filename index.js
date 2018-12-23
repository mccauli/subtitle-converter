const convert = require('./lib/converters');

convert(
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_srt.srt',
  '/tmp/test_srt.srt',
  {
    removeTextFormatting: true,
    shiftTimecode: 3,
    sourceFps: 25,
    outputFps: 23.976,
  },
)
  .then(res => console.log(res))
  .catch(err => console.log(err));

module.exports = {
  convert,
};
