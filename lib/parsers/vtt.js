const { parse } = require('node-webvtt');
const Joi = require('joi');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { secondsToMicroseconds } = require('../shared/utils');

function standardize(subtitleJSON) {
  return {
    global: {},
    body: subtitleJSON.cues.map((line, index) => {
      const styles = line.styles.split(' ')
        .reduce((obj, style) => {
          const [key, value] = style.split(':');
          obj[key] = value;
          return obj;
        }, {});
      return {
        id: index.toString(),
        startMicro: secondsToMicroseconds(line.start),
        endMicro: secondsToMicroseconds(line.end),
        styles,
        text: line.text,
      };
    }),
    source: subtitleJSON,
  };
}


async function vtt(subtitleText) {
  const subtitleJSON = await parse(subtitleText);
  const { error, value } = Joi.validate(standardize(subtitleJSON), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}

module.exports = vtt;
