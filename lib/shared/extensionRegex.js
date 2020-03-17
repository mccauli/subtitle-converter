/**
 * Regex Constants for Subtitle Extension Extraction
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
const vttFormatting = '.*';
const vttBlock = `(?:\\d+${lineBreak})?${vttTimeCode}${vttFormatting}${lineBreak}${multilineText}`;

const vttHeader = `^[^]?WEBVTT(?:${lineBreak}.+)?${lineBreak}{2}`;
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

const EXTENSION_REGEX = [
  { extension: '.srt', regex: new RegExp(`${srtHeader}${srtBody}${srtFooter}`) },
  { extension: '.vtt', regex: new RegExp(`${vttHeader}${vttBody}${vttFooter}`) },
  { extension: '.scc', regex: new RegExp(`${sccHeader}${sccBody}${sccFooter}`) },
  { extension: '.ttml', regex: new RegExp(`${ttmlHeader}${ttmlBody}${ttmlFooter}`) },
];

module.exports = { EXTENSION_REGEX };
