"use strict";

/**
 * Shift subtitle timecode based on fps value
 * @param data (object) required
 * @param sourceFps (integer or float) required
 * @param outputFps (integer or float) required
 * @returns shifted data
 */
function shiftTimecodeByFps(data, sourceFps, outputFps) {
  var shiftAmount = sourceFps / outputFps;
  return data.map(function (line) {
    line.startMicro *= shiftAmount;
    line.endMicro *= shiftAmount;
    return line;
  });
}

module.exports = shiftTimecodeByFps;