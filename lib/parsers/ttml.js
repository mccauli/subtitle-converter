const util = require('util');
const { parseString } = require('xml2js');
const R = require('ramda');
const Joi = require('joi-browser');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { timecodeToMicroseconds, cleanUpText, fixTimecodeOverlap } = require('../shared/utils');

const parseXml = util.promisify(parseString);

function standardize(subtitleJSON, options) {
  const { removeTextFormatting, timecodeOverlapLimiter } = options;
  let prevLine = '';
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
      text: cleanUpText(line._, removeTextFormatting),
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

async function ttml(subtitleText, options) {
  const subtitleJSON = await parseXml(subtitleText);
  const { error, value } = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}


module.exports = ttml;
