/**
 * Regex Constants for Subtitle Extension Detection
 */

// GENERAL REGEX
const lineBreak = '(?:\\r\\n|\\n|\\r)';

// VTT REGEX
// Minimum requirements for 'node-webvtt' library
const vttTimestamp = '\\d{2}:\\d{2}:\\d{2}[.]\\d{3}';
const vttTimeCode = `(${vttTimestamp})[ ]-->[ ]${vttTimestamp}`;
const vttBlock = `(\\d+${lineBreak})?${vttTimeCode}[^]*?(${lineBreak}{2,}|$)`;
const vttHeader = `^\\s*WEBVTT[^]*?${lineBreak}{2,}`;
const vttRegex = vttHeader + vttBlock;

// SCC REGEX
// Minimum requirements for scc_to_json module
const sccTimeCode = '\\d{2}:\\d{2}:\\d{2}[;:]\\d{2}';
const sccRegex = `${sccTimeCode}(?:(\\s)[a-fA-F0-9]{4})+[ ]?`;

// TTML REGEX (Earlier name: DFXP)
// Minimum requirements for 'xml2js' library
const ttmlRegex = '^([^]+?)?<tt.*?>';

// SRT REGEX
// Minimum requirements for 'srtEntries' module
const srtRegex = '-->';

const ALL_VALID_EXT_REGEX = new RegExp(`(${vttRegex}|${sccRegex}|${ttmlRegex}|${srtRegex})`);
const VALID_EXT_REGEX_ARRAY = [
  { extension: '.vtt', regex: new RegExp(vttRegex) },
  { extension: '.scc', regex: new RegExp(sccRegex) },
  { extension: '.ttml', regex: new RegExp(ttmlRegex) },
  { extension: '.srt', regex: new RegExp(srtRegex) },
];

module.exports = { ALL_VALID_EXT_REGEX, VALID_EXT_REGEX_ARRAY };
