const util = require('util');
const { scc: { toJSON } } = require('node-captions');
const Joi = require('joi');
const { JSON_SCHEMA } = require('../shared/constants');

const sccToJSON = util.promisify(toJSON);


function standardize(subtitleJSON) {
  return {
    global: {},
    body: subtitleJSON.map(line => ({
      id: line.id,
      start_micro: line.startTimeMicro,
      end_micro: line.endTimeMicro,
      captions: {
        frames: line.frames,
        pop_on: line.popOn,
        paint_on: line.paintOn,
        roll_up_rows: line.rollUpRows,
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
  const { error, value } = Joi.validate(standardize(subtitleJSON), JSON_SCHEMA);
  if (error) {
    throw new Error(error);
  }
  return value;
}

module.exports = scc;
