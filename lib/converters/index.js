const Joi = require('joi-browser');
const parse = require('../parsers');
const transform = require('../transformers');
const validateStandardized = require('../validators/standardizedJSON');
const srt = require('./srt');
const vtt = require('./vtt');
const { PARAM_SCHEMA } = require('../shared/constants');
const { getExtension } = require('../parsers/getExtension');

function generateOutputData(jsonData, outputExtension) {
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

function convert(subtitleText, inputExtension, outputExtension, options) {
  // set default options
  if (!options) {
    options = {
      timecodeOverlapLimiter: false,
    };
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
    { abortEarly: false },
  );

  if (validationError) throw Error(validationError);

  // overwriting invalid inputExtension
  const extractedExtension = getExtension(subtitleText);
  if (extractedExtension && extractedExtension !== inputExtension) inputExtension = extractedExtension;

  // read inputFile, convert to standardized JSON format
  const { data, status: parseStatus } = parse(subtitleText, inputExtension, options);

  // run optional transformations
  const result = transform(data.body, options);

  // add validation options
  const validationOptions = {
    startsAtZeroHour: options.startAtZeroHour,
    reversedTimecodes: true,
    overlappingTimecodes: true,
    formattedText: options.removeTextFormatting,
  };
  const outputStatus = validateStandardized(result, validationOptions);

  data.body = result;
  // generate output data according to output extension
  const subtitle = generateOutputData(data, outputExtension);

  const status = { ...parseStatus, ...outputStatus, success: parseStatus.success && outputStatus.success };
  return { subtitle, status };
}

module.exports = convert;
