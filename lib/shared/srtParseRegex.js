/**
 * Regex string variables
 */
// Entry Detection
const potentialTimecode = '(?:\\d{1,}[^\\n\\d]+?){7}.*'; // TODO: add --> instead of least 7 1+ digit number
const terminator = `(?=(?:\\n${potentialTimecode}|$))`;

// Entry Validation
const validHours = '(\\d{1,2})';
const validMinutes = '([0-5]?\\d)';
const validSeconds = '([0-5]?\\d)';
const validMilliseconds = '(\\d{3})';
const any = '[^\\n\\d]+?'; // Any character but digit or newline
const validTimestamp = `${validHours}${any}${validMinutes}${any}${validSeconds}${any}${validMilliseconds}`;
const validTimecode = `(?<start>${validTimestamp})[^\\n\\d]+?(?<end>${validTimestamp})[^\\n\\d]*?`;

// Strict Timestamp Validation
const strictHours = '(\\d{2})';
const strictMinutes = '([0-5]\\d)';
const strictSeconds = '([0-5]\\d)';
const strictMilliseconds = '(\\d{3})';

/**
 * Assembling Regex from variables
 */
const potentialTimecodeRegex = new RegExp(potentialTimecode, 'g');
const potentialSrtBlockRegex = new RegExp(`${potentialTimecode}[^]+?${terminator}`, 'g');
const validTimecodeRegex = new RegExp(`${validTimecode}`);
const validEntryRegex = new RegExp(`${validTimecode}\\n(?<text>[^]+)`);
const emptyEntryRegex = new RegExp(`${validTimecode}\\s*$`);
const strictTimestampRegex = new RegExp(`${strictHours}:${strictMinutes}:${strictSeconds},${strictMilliseconds}`);

module.exports = {
  potentialTimecodeRegex,
  potentialSrtBlockRegex,
  strictTimestampRegex,
  validEntryRegex,
  emptyEntryRegex,
  validTimecodeRegex,
};
