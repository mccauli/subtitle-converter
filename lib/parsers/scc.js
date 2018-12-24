const util = require('util');
const { scc: { toJSON } } = require('node-captions');
const Joi = require('joi');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { cleanUpText, fixTimecodeOverlap } = require('../shared/utils');

const sccToJSON = util.promisify(toJSON);


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
