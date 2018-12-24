const Joi = require('joi');
const path = require('path');
const parse = require('../parsers');
const transform = require('../transformers');
// const dfxp = require('./dfxp');
// const scc = require('./scc');
const srt = require('./srt');
// const ttml = require('./ttml');
// const vtt = require('./vtt');
const { PARAM_SCHEMA } = require('../shared/constants');
const toSrt = require('./srt');

async function toOutputFormat(data, outputFileName) {
  // check outputFileName ext and convert to that format
  return toSrt(data, outputFileName);
}

async function generateOutputFile(jsonData, outputFile) {
  const fileExtension = path.extname(outputFile);
  switch (fileExtension) {
    case '.dfxp':
      return outputFile;
    case '.scc':
      return outputFile;
    case '.srt':
      return srt(jsonData, outputFile);
    case '.ttml':
      return outputFile;
    case '.vtt':
      return outputFile;
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
