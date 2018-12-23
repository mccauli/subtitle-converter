const util = require('util');
const { scc: { toJSON } } = require('node-captions');
const Joi = require('joi');
const { SUBTITLE_SCHEMA } = require('../shared/constants');

const sccToJSON = util.promisify(toJSON);


function standardize(subtitleJSON) {
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
      text: line.text,
    })),
    source: subtitleJSON,
  };
}

async function scc(subtitleText) {
  const lines = subtitleText.split(/\r\n|\n/);
  const subtitleJSON = await sccToJSON(lines);
  const { error, value } = Joi.validate(standardize(subtitleJSON), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}

module.exports = scc;
