const Joi = require('joi');
const { parse } = require('../parsers');
const { validate } = require('../validators');
const { modifyData } = require('../transformers');
const { PARAM_SCHEMA } = require('../shared/constants');
const toSrt = require('./srt');

async function toOutputFormat(data, outputFileName) {
  // check outputFileName ext and convert to that format
  return toSrt(data, outputFileName);
}

async function convert(file, outputFileName, options) {
  const { error, value } = Joi.validate({ file, outputFileName, options }, PARAM_SCHEMA);
  if (error) throw new Error(error);
  try {
    const data = await parse(file);
    const modifiedData = await modifyData(data, options);
    const validatedData = await validate(modifiedData);
    return toOutputFormat(validatedData, outputFileName);
  } catch (error) {
    throw new Error(error); 
  }
}

// const options = {
//   shift: null,
//   source_fps: 29.97,
//   output_fps: 25,
//   removeTextFormatting: false,
// }
// convert('/Users/dcooper/REPOSITORIES/janus/tests/test_subs/good_srt.srt', '/tmp/shifted_srt.srt', options).then(res => console.log({ res })).catch(err => console.log({ err }));

module.exports = convert;