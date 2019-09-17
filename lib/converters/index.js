const Joi = require('joi-browser');
const parse = require('../parsers');
const transform = require('../transformers');
const srt = require('./srt');
const vtt = require('./vtt');
const { PARAM_SCHEMA } = require('../shared/constants');

async function generateOutputData(jsonData, outputExtension) {
  switch (outputExtension) {
    case '.srt':
      return srt(jsonData);
    case '.vtt':
      return vtt(jsonData);
    default:
      throw Error(`File type ${outputExtension} is not supported. Supported output file types include:\n`
      + 'srt');
  }
}

async function convert(subtitleText, inputExtension, outputExtension, options) {
  if (!options) {
    options = {};
  }
  // validate input options
  const { error: validationError } = Joi.validate(
    {
      subtitleText,
      inputExtension,
      outputExtension,
      options,
    },
    PARAM_SCHEMA,
  );
  if (validationError) {
    throw Error(validationError);
  }
  try {
    // read inputFile, convert to standardized JSON format
    const data = await parse(subtitleText, inputExtension, options);
    // run optional transformations
    const transformedData = await transform(data, options);
    // generate output data according to output extension
    return generateOutputData(transformedData, outputExtension);
  } catch (error) {
    throw Error(error);
  }
}

module.exports = convert;
