const Joi = require('joi-browser');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { cleanUpText, fixTimecodeOverlap } = require('../shared/utils');

/**
* Converts the SCC file to a proprietary JSON format
* @function
* @param {string} data - Entire SCC file content
* @public
*/
async function sccToJSON(lines, callback) {
   var idx = 0;
   jsonCaptions = [];
   for (idx = 0; idx < lines.length; idx++) {
       if (!module.exports.verify(lines[idx])) {
           module.exports.translateLine(lines[idx].toLowerCase());
       }
   }
   if (paintBuffer.length > 0) {
       rollUp(true);
   }
   if (!jsonCaptions[jsonCaptions.length - 1]) {
       callback('Failed to convert SCC data');
       return;
   }
   if (jsonCaptions[jsonCaptions.length - 1].endTimeMicro === undefined) {
       jsonCaptions[jsonCaptions.length - 1].endTimeMicro = jsonCaptions[jsonCaptions.length - 1].startTimeMicro;
   }
   callback(null, jsonCaptions);
};


function standardize(subtitleJSON, options) {
  const { removeTextFormatting, timecodeOverlapLimiter } = options;
  let prevLine = '';
  return {
    global: {},
    body: subtitleJSON.map(line => ({
      id: line.id,
      startMicro: line.startTimeMicro,
      endMicro: line.endTimeMicro,
      captions: {
        frames: line.frames,
        popOn: line.popOn,
        paintOn: line.paintOn,
        rollUpRows: line.rollUpRows,
        commands: line.commands,
      },
      text: cleanUpText(line.text, removeTextFormatting),
    }))
      .filter(line => line.text)
      .map((line, index) => {
        // if empty lines were deleted, we need to make sure the id is in sequential order
        line.id = (index + 1).toString();
        const newLine = fixTimecodeOverlap(line, prevLine, timecodeOverlapLimiter);
        prevLine = newLine;
        return newLine;
      }),
    source: subtitleJSON,
  };
}

async function scc(subtitleText, options) {
  const lines = subtitleText.split(/\r\n|\n/);
  const subtitleJSON = await sccToJSON(lines);
  const { error, value } = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}

module.exports = scc;
