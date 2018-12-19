/**
 * Shift subtitle timecode based on fps value
 * @param data (object) required
 * @param fps (integer or float) required
 * @param fpsToConvertTo (integer or float) required
 * @returns shifted data
 */
 
function fpsStandardsConversion(data, fps, fpsToConvertTo) {
  for (const subtitle of data) {
    const fpsTimeShift = parseFloat(fps / fpsToConvertTo);
    subtitle.start_micro = parseFloat(subtitle.start_micro * fpsTimeShift);
    subtitle.end_micro = parseFloat(subtitle.end_micro * fpsTimeShift);
  }
  return data;
}

module.exports = fpsStandardsConversion;
