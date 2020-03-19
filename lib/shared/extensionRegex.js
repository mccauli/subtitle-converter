/**
 * Regex Constants for Subtitle Extension Validation
 * Minimum requirements satisfy repository functions to parse files.
 */

// GENERAL REGEX
const lineBreak = '(?:\\r\\n|\\n|\\r)';

// SRT REGEX
// Requirements: have a single srt block with valid timestamp
const srtTimestamp = '(?:\\d{2}:\\d{2}:\\d{2},\\d{3})';
const srtTimeCode = `(${srtTimestamp})[ ]-->[ ]${srtTimestamp}`;
const srtRegex = `\\d+${lineBreak}${srtTimeCode}${lineBreak}(?:.+)`;

// VTT REGEX
// Requirements: WEBVTT header, double newline and valid timestamp
const vttTimestamp = '\\d{2}:\\d{2}:\\d{2}[.]\\d{3}';
const vttTimeCode = `(${vttTimestamp})[ ]-->[ ]${vttTimestamp}`;
const vttBlock = `(\\d+${lineBreak})?${vttTimeCode}[^]*?(${lineBreak}{2,}|$)`;
const vttHeader = `^\\s*WEBVTT[^]*?${lineBreak}{2,}`;
const vttRegex = vttHeader + vttBlock;

// SCC REGEX
// Requirement: have at lease one valid line
const sccTimeCode = '\\d{2}:\\d{2}:\\d{2}[;:]\\d{2}';
const sccRegex = `${sccTimeCode}(?:(\\s)[a-fA-F0-9]{4})+[ ]?`;


// TTML REGEX (OR DFXP)
// Requirements: Have the following opening/closing tags:tt, body, div, p.
//               Indicate valid timestamps with 'begin' and 'end' key
const ttmlHeader = '^([^]+?)?<tt.*?>[^]+?<body.*?>[^]+?<div.*?>[^]+?';
const ttmlTimestamp = '\\d{2}:\\d{2}:\\d{2}[.,]\\d{3}';
const ttmlLine = `<p .*?begin="(${ttmlTimestamp})" end="${ttmlTimestamp}">[^]+?(?:<[/]p>)`;
const ttmlBody = `(?:${ttmlLine}\\s*)+`;
const ttmlFooter = '<[/]div>\\s*<[/]body>\\s*<[/]tt>';
const ttmlRegex = `${ttmlHeader}${ttmlBody}${ttmlFooter}`;

const ALL_VALID_EXT_REGEX = new RegExp(`(${srtRegex}|${vttRegex}|${sccRegex}|${ttmlRegex})`);
const VALID_EXT_REGEX_ARRAY = [
  { extension: '.srt', regex: new RegExp(srtRegex) },
  { extension: '.vtt', regex: new RegExp(vttRegex) },
  { extension: '.scc', regex: new RegExp(sccRegex) },
  { extension: '.ttml', regex: new RegExp(ttmlRegex) },
];

module.exports = { ALL_VALID_EXT_REGEX, VALID_EXT_REGEX_ARRAY };
