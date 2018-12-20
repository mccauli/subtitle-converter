const fpsStandardConversion = require('./fps_standard_conversion');
const shiftSubtitleTimecode = require('./shift_subtitle_timecode');

/**
 * Call modifying functions based on passed in options
 * @param data (object) - required
 * @param options (object) - required
 * @returns modified data
 */
async function modifyData(data, options) {
  try {
    let modifiedData = {...data};
    if (options.shift) {
      modifiedData.body = shiftSubtitleTimecode(modifiedData.body, options.shift);
    } else if (options.source_fps && options.output_fps) {
      modifiedData.body = fpsStandardConversion(modifiedData.body, options.source_fps, options.output_fps);
    }
    
    // check for removeFormatting
    // call some function
    return modifiedData;
  } catch (error) {
    throw new Error(error);
  }

}

module.exports = {
  modifyData,
};
