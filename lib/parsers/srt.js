const { fromSrt } = require('subtitles-parser');
const Joi = require('joi');
const { JSON_SCHEMA } = require('../shared/constants');
const { millisecondsToMicroseconds } = require('../shared/utils');

function standardize(subtitleJSON) {
  return {
    global: {},
    body: subtitleJSON.map(line => ({
      id: line.id,
      start_micro: millisecondsToMicroseconds(line.startTime),
      end_micro: millisecondsToMicroseconds(line.endTime),
      text: line.text,
    })),
    source: subtitleJSON,
  };
}

async function srt(subtitleText) {
  const subtitleJSON = fromSrt(subtitleText, true);
  const { error, value } = Joi.validate(standardize(subtitleJSON), JSON_SCHEMA);
  if (error) {
    throw new Error(error);
  }
  return value;
}

module.exports = srt;
