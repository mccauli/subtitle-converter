const Joi = require('joi');
const parse = require('../parsers');
const toSrt = require('./srt');
const { PARAM_SCHEMA } = require('../shared/constants');

async function convert(file, outputFileName, options) {
  const { error } = Joi.validate({ file, outputFileName, options }, PARAM_SCHEMA);
  if (error) console.log({error}); 
  
  const data = await parse(file).catch(err => { throw new Error(err); });
  const convertedFile = await toSrt(data, outputFileName).catch(err => { throw new Error(err); });
  return convertedFile;
}

// convert('/Users/dcooper/REPOSITORIES/janus/tests/test_subs/good_srt.srt', '/tmp/shifted_srt.srt').then(res => console.log({ res })).catch(err => console.log({ err }));

module.exports = convert;