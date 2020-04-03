/**
 * Regex string variables
 */
// Entry Detection
const potentialTimecode = '.*\\d.*-->.*\\d.*';
const potentialIndex = `.+(?=\\n${potentialTimecode})`;
const blockTerminator = `(?=(?:\\n(?:.+\\n)?${potentialTimecode}|$))`;

// Entry Validation
const validHours = '\\d{2}';
const validMinutes = '[0-5]\\d';
const validSeconds = '[0-5]\\d';
const validMilliseconds = '\\d{3}';
const any = '[^\\n\\d]+?'; // Any character but digit or newline
const validTimestamp = `${validHours}${any}${validMinutes}${any}${validSeconds}${any}${validMilliseconds}`;
const validTimecode = `${validTimestamp}[^\\n\\d]+?${validTimestamp}[^\\n\\d]*?`;
const textOfEntry = '[^]+';

// Capturing Groups
const Group1 = `(${validTimestamp})`;
const Group2 = `(${validTimestamp})`;
const Group3 = `(${textOfEntry})`;

/**
 * Assembling Regex from variables
 */
const potentialIndexRegex = new RegExp(potentialIndex, 'g');
const potentialTimecodeRegex = new RegExp(potentialTimecode, 'g');
const potentialSrtBlockRegex = new RegExp(`(\\n*)(?:.+\\n)?${potentialTimecode}[^]+?${blockTerminator}`, 'g');
const invalidFirstEntryRegex = new RegExp(`^[^]+?(?=(?:.+\\n)?${potentialTimecode})`);
const validTimecodeRegex = new RegExp(validTimecode);
const validEntryRegexGroups = new RegExp(`${Group1}[^\\n\\d]+?${Group2}[^\\n\\d]*?\\n${Group3}`);
const emptyEntryRegex = new RegExp(`${validTimecode}\\s*$`);
const strictTimestampRegex = new RegExp(`${validHours}:${validMinutes}:${validSeconds},${validMilliseconds}`);

module.exports = {
  potentialIndexRegex,
  potentialTimecodeRegex,
  potentialSrtBlockRegex,
  strictTimestampRegex,
  validEntryRegexGroups,
  emptyEntryRegex,
  validTimecodeRegex,
  invalidFirstEntryRegex,
};
