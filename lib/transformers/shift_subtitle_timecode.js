/**
 * Shift subtitle timecode based on seconds value passed in
 * @param data (object) - required
 * @param shiftAmountInSeconds (integer or float in seconds) - positive value adds time, negative values removes time
 * @returns shifted data
 */

function shiftSubtitleTimecode(data, shiftAmountInSeconds) {
  const shiftAmountInMicroSeconds = parseFloat(shiftAmountInSeconds * 1000000);
  for (const subtitle of data) {
    subtitle.start_micro = parseFloat(subtitle.start_micro + shiftAmountInMicroSeconds);
    subtitle.end_micro = parseFloat(subtitle.end_micro + shiftAmountInMicroSeconds);
  }
  return data;
}

module.exports = shiftSubtitleTimecode;
