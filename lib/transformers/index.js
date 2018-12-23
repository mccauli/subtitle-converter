const shiftTimecodeByFps = require('./fps_standard_conversion');
const shiftTimecodeBySeconds = require('./shift_subtitle_timecode');

async function transform(data, options) {
  const { shiftTimecode, sourceFps, outputFps } = options;
  if (shiftTimecode) {
    data.body = shiftTimecodeBySeconds(data.body, shiftTimecode);
  }
  if (sourceFps && outputFps) {
    data.body = shiftTimecodeByFps(data.body, sourceFps, outputFps);
  }
  return data;
}

module.exports = transform;
