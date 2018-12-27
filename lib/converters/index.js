const Joi = require('joi');
const path = require('path');
const parse = require('../parsers');
const transform = require('../transformers');
const srt = require('./srt');
const vtt = require('./vtt');
const { PARAM_SCHEMA } = require('../shared/constants');

async function generateOutputFile(jsonData, outputFile) {
  const fileExtension = path.extname(outputFile);
  switch (fileExtension) {
    case '.srt':
      return srt(jsonData, outputFile);
    case '.vtt':
      return vtt(jsonData, outputFile);
    default:
      throw Error(`File type ${fileExtension} is not supported. Supported output file types include:\n` +
        'srt');
  }
}

async function convert(inputFile, outputFile, options) {
  if (!options) {
    options = {};
  }
  // validate input options
  const { error: validationError } = Joi.validate({ inputFile, outputFile, options }, PARAM_SCHEMA);
  if (validationError) {
    throw Error(validationError);
  }
  try {
    // read inputFile, convert to standardized JSON format
    const data = await parse(inputFile, options);
    // run optional transformations
    const transformedData = await transform(data, options);
    // write data to outputFile
    return generateOutputFile(transformedData, outputFile);
  } catch (error) {
    throw Error(error);
  }
}

module.exports = convert;
