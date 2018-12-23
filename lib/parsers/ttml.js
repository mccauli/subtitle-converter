const util = require('util');
const { parseString } = require('xml2js');
const R = require('ramda');
const Joi = require('joi');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { timecodeToMicroseconds } = require('../shared/utils');

const parseXml = util.promisify(parseString);

function standardize(subtitleJSON) {
  const global = R.path(['tt', '$'], subtitleJSON);
  const body = R.path(['tt', 'body', '0', 'div', '0', 'p'], subtitleJSON);
  return {
    global: {
      language: global['xml:lang'],
    },
    body: body.map((line, index) => ({
      id: index.toString(),
      startMicro: timecodeToMicroseconds(R.path(['$', 'begin'], line)),
      endMicro: timecodeToMicroseconds(R.path(['$', 'end'], line)),
      text: line._,
    })),
    source: subtitleJSON,
  };
}

async function ttml(subtitleText) {
  const subtitleJSON = await parseXml(subtitleText);
  const { error, value } = Joi.validate(standardize(subtitleJSON), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}


module.exports = ttml;
