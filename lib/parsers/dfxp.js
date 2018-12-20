const util = require('util');
const { parseString } = require('xml2js');
const Joi = require('joi');
const R = require('ramda');
const { JSON_SCHEMA } = require('../shared/constants');
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
      start_micro: timecodeToMicroseconds(R.path(['$', 'begin'], line)),
      end_micro: timecodeToMicroseconds(R.path(['$', 'end'], line)),
      text: line._,
    })),
    source: subtitleJSON,
  };
}

async function dfxp(subtitleText) {
  const subtitleJSON = await parseXml(subtitleText);
  const { error, value } = Joi.validate(standardize(subtitleJSON), JSON_SCHEMA);
  if (error) {
    throw new Error(error);
  }
  return value;
}

module.exports = dfxp;
