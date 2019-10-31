const fixTimecodeOverlap = require('./fix_timecode_overlap');
const shiftTimecodeByFps = require('./fps_standard_conversion');
const shiftTimecodeBySeconds = require('./shift_subtitle_timecode');
const shiftToZeroHour = require('./shift_to_zero_hour');

function transform(data, options) {
  const {
    timecodeOverlapLimiter, shiftTimecode, sourceFps, outputFps, startAtZeroHour,
  } = options;
  let result = data;

  if (timecodeOverlapLimiter !== false) { // can pass in 0 to see if there is any overlap
    result = fixTimecodeOverlap(result, timecodeOverlapLimiter);
  }
  if (shiftTimecode) {
    result = shiftTimecodeBySeconds(result, shiftTimecode);
  }
  if (sourceFps && outputFps) {
    result = shiftTimecodeByFps(result, sourceFps, outputFps);
  }
  if (startAtZeroHour) {
    result = shiftToZeroHour(result);
  }
  return result;
}

module.exports = transform;
