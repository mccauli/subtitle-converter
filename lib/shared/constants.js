const Joi = require('joi-browser');

const SUBTITLE_SCHEMA = Joi.object().keys({
  global: Joi.object().keys({
    language: Joi.string(),
    color: Joi.string(),
    textAlign: Joi.string(),
  }),
  body: Joi.array().items(Joi.object().keys({
    id: Joi.string(),
    timecode: Joi.string(),
    startMicro: Joi.number().unit('microseconds'),
    endMicro: Joi.number().unit('microseconds'),
    captions: {
      frames: Joi.number().integer(),
      popOn: Joi.boolean(),
      paintOn: Joi.boolean(),
      rollUpRows: Joi.number().integer(),
      commands: Joi.string(),
    },
    styles: Joi.object().keys({
      align: Joi.string(),
      line: Joi.string(),
      position: Joi.string(),
      size: Joi.string(),
    }),
    text: Joi.string(),
  })),
  source: Joi.any(),
});

const PARAM_SCHEMA = Joi.object().keys({
  subtitleText: Joi.string().required(),
  inputExtension: Joi.string().required(),
  outputExtension: Joi.string().required(),
  options: Joi.object().keys({
    shiftTimecode: Joi.number(),
    sourceFps: Joi.number().positive(),
    outputFps: Joi.number().positive(),
    removeTextFormatting: Joi.boolean(),
    timecodeOverlapLimiter: Joi.alternatives().try(Joi.number().positive().allow(0), Joi.boolean()),
    startAtZeroHour: Joi.boolean(),
  }),
});


/**
 * Regex Constants for Subtitle Validation
 */
// GENERAL REGEX
const lineBreak = '(?:\\r\\n|\\n|\\r)';
const multilineText = `(?:(?:.+)${lineBreak})+`;

// SRT REGEX
const srtTimestamp = '(?:\\d{2}:\\d{2}:\\d{2},\\d{3})';
const srtTimeCode = `${srtTimestamp} --> ${srtTimestamp}`;
const srtBlock = `(\\d+)${lineBreak}${srtTimeCode}${lineBreak}${multilineText}`;
const multiSrtBlock = `(?:${srtBlock}${lineBreak})+`;
const srtFile = `^${multiSrtBlock}${srtBlock}${lineBreak}*$`; // last line break optional

const REGEX_CONSTANTS = {
  srtRegex: {
    multiSrtBlock: new RegExp(multiSrtBlock),
    srtFile: new RegExp(srtFile),
  },
};

module.exports = {
  SUBTITLE_SCHEMA,
  PARAM_SCHEMA,
  REGEX_CONSTANTS,
};
