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
const srtHeader = '^[^]1';
const srtTimestamp = '(?:\\d{2}:\\d{2}:\\d{2},\\d{3})';
const srtTimeCode = `(${srtTimestamp})[ ]-->[ ]${srtTimestamp}`;
const srtBlock = `(?:\\d+${lineBreak}${srtTimeCode}${lineBreak}(?:.+${lineBreak})+)`;
const srtMultiBlock = `(?:${srtBlock}${lineBreak}+)+`;
const srtFile = `^${srtMultiBlock}${srtBlock}${lineBreak}*$`; // last line break optional
// const srtFooter = `${srtBlock}${lineBreak}*`;

// VTT REGEX
const vttTimestamp = '\\d{2}:\\d{2}:\\d{2}[.]\\d{3}';
const vttTimeCode = `(${vttTimestamp})[ ]-->[ ]${vttTimestamp}`;
const vttFormatting = '.*'; // TODO add 'key:value' regex
const vttBlock = `(?:\\d+${lineBreak})?${vttTimeCode}${vttFormatting}${lineBreak}${multilineText}`;

const vttHeader = `^[^]?WEBVTT${lineBreak}{2}`;
const vttBody = `(?:${vttBlock}${lineBreak})+`;
const vttFooter = `${vttBlock}${lineBreak}*$`;
const vttFile = `${vttHeader}${vttBody}${vttFooter}`;

// SCC REGEX
const sccTimestampNonDropFrame = '\\d{2}:\\d{2}:\\d{2}:\\d{2}';
const sccTimestampDropFrame = '\\d{2}:\\d{2}:\\d{2};\\d{2}';
const sccTimeCode = `(${sccTimestampDropFrame}|${sccTimestampNonDropFrame})`;
const sccLine = `${sccTimeCode}(?:(\t|[ ])[a-fA-F0-9]{4})+[ ]?`;

const sccHeader = `^Scenarist_SCC[ ]V1.0${lineBreak}{2}`;
const sccBody = `(?:${sccLine}${lineBreak}{2})+`;
const sccFooter = `${sccLine}${lineBreak}*$`;
const sccFile = `${sccHeader}${sccBody}${sccFooter}`;

// DFXP REGEX
const dfxpTimestamp = '\\d{2}:\\d{2}:\\d{2}[.]\\d{3}';
const dfxpLine = `<p begin="(${dfxpTimestamp})" end="${dfxpTimestamp}">.+<[/]p>`;

const dfxpHeader = `^<\\?xml version=.+encoding=.+\\?>[^]*<tt xml[^]*<body[^]*<div[^]*?>${lineBreak}( |\t)*`;
const dfxpBody = `(?:${dfxpLine}${lineBreak}( |\t)*)+`;
const dfxpFooter = `<[/]div>${lineBreak}( |\t)*<[/]body>${lineBreak}( |\t)*<[/]tt>${lineBreak}*$`;
const dfxpFile = `${dfxpHeader}${dfxpBody}${dfxpFooter}`;

// TTML REGEX

const REGEX_CONSTANTS = {
  srtRegex: {
    type: 'SRT',
    header: new RegExp(srtHeader),
    partialFile: new RegExp(srtMultiBlock),
    completeFile: new RegExp(srtFile),
  },
  vttRegex: {
    type: 'VTT',
    header: new RegExp(vttHeader),
    partialFile: new RegExp(vttBody),
    completeFile: new RegExp(vttFile),
  },
  sccRegex: {
    type: 'SCC',
    header: new RegExp(sccHeader),
    partialFile: new RegExp(sccBody),
    completeFile: new RegExp(sccFile),
  },
  dfxpRegex: {
    type: 'DFXP',
    header: new RegExp(dfxpHeader),
    partialFile: new RegExp(dfxpBody),
    completeFile: new RegExp(dfxpFile),
  },
};

module.exports = {
  SUBTITLE_SCHEMA,
  PARAM_SCHEMA,
  REGEX_CONSTANTS,
};
