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
const srtHeader = '^1';
const srtTimestamp = '(?:\\d{2}:\\d{2}:\\d{2},\\d{3})';
const srtTimeCode = `(${srtTimestamp}) --> ${srtTimestamp}`;
const srtBlock = `\\d+${lineBreak}${srtTimeCode}${lineBreak}${multilineText}`;
const srtMultiBlock = `(?:${srtBlock}${lineBreak})+`;
const srtFile = `^${srtMultiBlock}${srtBlock}${lineBreak}*$`; // last line break optional

// VTT REGEX
const vttHeader = `^WEBVTT${lineBreak}{2}`;
const vttTimestamp = '(?:\\d{2}:\\d{2}:\\d{2}.\\d{3})';
const vttTimeCode = `(${vttTimestamp}) --> ${vttTimestamp}`;
const vttFormatting = '.*'; // TODO add style formatting
const vttBlock = `${vttTimeCode}${vttFormatting}${lineBreak}${multilineText}`;
const vttMultiBlock = `(?:${vttBlock}${lineBreak})+`;
const vttFile = `${vttHeader}${vttMultiBlock}${vttBlock}${lineBreak}*$`; // last line break optional

const REGEX_CONSTANTS = {
  srtRegex: {
    header: new RegExp(srtHeader),
    multiBlock: new RegExp(srtMultiBlock),
    completeFile: new RegExp(srtFile),
  },
  vttRegex: {
    header: new RegExp(vttHeader),
    multiBlock: new RegExp(vttMultiBlock),
    completeFile: new RegExp(vttFile),
  },
};

module.exports = {
  SUBTITLE_SCHEMA,
  PARAM_SCHEMA,
  REGEX_CONSTANTS,
};
