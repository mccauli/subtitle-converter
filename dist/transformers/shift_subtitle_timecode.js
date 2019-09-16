'use strict';

var _require = require('../shared/utils'),
    secondsToMicroseconds = _require.secondsToMicroseconds;

/**
 * Shift subtitle timecode based on seconds value passed in
 * @param data (object) - required
 * @param shiftAmountInSeconds (integer or float in seconds) - positive value adds time, negative values removes time
 * @returns shifted data
 */

function shiftTimecodeBySeconds(data, shiftAmountInSeconds) {
  var shiftAmountInMicroSeconds = secondsToMicroseconds(shiftAmountInSeconds);
  return data.map(function (line) {
    line.startMicro += shiftAmountInMicroSeconds;
    line.endMicro += shiftAmountInMicroSeconds;
    return line;
  });
}

module.exports = shiftTimecodeBySeconds;