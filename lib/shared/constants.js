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
const srtTimeCode = `(${srtTimestamp})[ ]-->[ ]${srtTimestamp}`;
const srtBlock = `\\d+${lineBreak}${srtTimeCode}${lineBreak}${multilineText}`;

const srtHeader = `^[^]?1${lineBreak}${srtTimeCode}${lineBreak}${multilineText}${lineBreak}+`;
const srtBody = `(?:${srtBlock}${lineBreak}+)+`;
const srtFooter = `${srtBlock}`;

// VTT REGEX
const vttTimestamp = '\\d{2}:\\d{2}:\\d{2}[.]\\d{3}';
const vttTimeCode = `(${vttTimestamp})[ ]-->[ ]${vttTimestamp}`;
const vttFormatting = '.*'; // TODO add 'key:value' regex
const vttBlock = `(?:\\d+${lineBreak})?${vttTimeCode}${vttFormatting}${lineBreak}${multilineText}`;

const vttHeader = `^[^]?WEBVTT${lineBreak}{2}`;
const vttBody = `(?:${vttBlock}${lineBreak})+`;
const vttFooter = `${vttBlock}`;

// SCC REGEX
const sccTimestampNonDropFrame = '\\d{2}:\\d{2}:\\d{2}:\\d{2}';
const sccTimestampDropFrame = '\\d{2}:\\d{2}:\\d{2};\\d{2}';
const sccTimeCode = `(${sccTimestampDropFrame}|${sccTimestampNonDropFrame})`;
const sccLine = `${sccTimeCode}(?:(\t|[ ])[a-fA-F0-9]{4})+[ ]?`;

const sccHeader = `^[^]?Scenarist_SCC[ ]V1.0${lineBreak}{2}`;
const sccBody = `(?:${sccLine}${lineBreak}{2})+`;
const sccFooter = `${sccLine}`;

// TTML REGEX (OR DFXP)
const ttmlTimestamp = '\\d{2}:\\d{2}:\\d{2}[.]\\d{3}';
const ttmlLine = `<p .*?begin="(${ttmlTimestamp})" end="${ttmlTimestamp}">[^]+?(?:<[/]p>)`;

const ttmlHeader = `^[^]+?<tt[^]+?<body[^]+?<div.*?>${lineBreak}( |\t)*`;
const ttmlBody = `(?:${ttmlLine}${lineBreak}( |\t)*)+`;
const ttmlFooter = `<[/]div>${lineBreak}( |\t)*<[/]body>${lineBreak}( |\t)*<[/]tt>`;

const REGEX_CONSTANTS = {
  srt: {
    extension: '.srt',
    regex: new RegExp(`${srtHeader}${srtBody}${srtFooter}`),
  },
  vtt: {
    extension: '.vtt',
    regex: new RegExp(`${vttHeader}${vttBody}${vttFooter}`),
  },
  scc: {
    extension: '.scc',
    regex: new RegExp(`${sccHeader}${sccBody}${sccFooter}`),
  },
  ttml: {
    extension: '.ttml',
    regex: new RegExp(`${ttmlHeader}${ttmlBody}${ttmlFooter}`),
  },
};

module.exports = {
  SUBTITLE_SCHEMA,
  PARAM_SCHEMA,
  REGEX_CONSTANTS,
};
