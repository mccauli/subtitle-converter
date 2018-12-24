const { fromSrt } = require('subtitles-parser');
const Joi = require('joi');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { millisecondsToMicroseconds, cleanUpText, fixTimecodeOverlap } = require('../shared/utils');

function standardize(subtitleJSON, options) {
  const { removeTextFormatting, timecodeOverlapLimiter } = options;
  let prevLine = '';
  return {
    global: {},
    body: subtitleJSON
      .map(line => ({
        id: line.id,
        startMicro: millisecondsToMicroseconds(line.startTime),
        endMicro: millisecondsToMicroseconds(line.endTime),
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

async function srt(subtitleText, options) {
  const subtitleJSON = fromSrt(subtitleText, true);
  const { error, value } = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}

module.exports = srt;
