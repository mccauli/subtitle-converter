const { timecodeToMicroseconds } = require('../shared/utils');

// Regex building blocks
const potentialTimecode = '(?:\\d{1,}[^\\n\\d]+?){5,8}.*'; // at least having 5 1+ digit numbers with separators
const terminator = `(?=(?:\\n${potentialTimecode}|$))`;
const validHours = '(\\d{1,2})';
const validMinutes = '([0-5]?\\d)';
const validSeconds = '([0-5]?\\d)';
const validMilliseconds = '(\\d{3})';
const any = '[^\\n\\d]+?';
const validTimestamp = `${validHours}${any}${validMinutes}${any}${validSeconds}${any}${validMilliseconds}`;
const validTimecode = `(?<start>${validTimestamp})[^\\n\\d]+?(?<end>${validTimestamp})[^\\n\\d]*?`;

// Assembling Regexs from building blocks
const potentialSrtBlockRegex = new RegExp(`${potentialTimecode}[^]+?${terminator}`, 'g');
const potentialTimecodeRegex = new RegExp(potentialTimecode, 'g');
const strictTimestampRegex = new RegExp(`${validHours}:${validMinutes}:${validSeconds},${validMilliseconds}`);
const validEntryRegex = new RegExp(`${validTimecode}\\n(?<text>[^]+)`);

// Object for reduce function, including return values
const resultInit = {
  currentIndex: 1,
  validEntries: [],
  status: {
    success: true,
    invalidEntries: [],
    invalidTimecodes: [],
  },
};

// In case option is omitted
const optionDefault = {
  invalidEntries: true,
  invalidTimecodes: true,
};

// Standardize timecode to HH:(M)M:SS:mmm format
function standardizeTimestamp(timecode) {
  if (strictTimestampRegex.test(timecode)) {
    return timecode;
  }
  let result = timecode.replace(/[^\d]+/g, ':');
  result = result.replace(/:(?=\d{3})/, ','); // change separator before milliseconds
  return result;
}

// Adding invalid entry to result
function pushInvalid(acc, cur, options) {
  const invalidTimecode = cur.match(potentialTimecodeRegex)[0];
  acc.status.success = false;
  if (options.invalidEntries) acc.status.invalidEntries.push(cur); // do we really need to make it an object?
  if (options.invalidTimecodes) acc.status.invalidTimecodes.push(invalidTimecode);
  return acc;
}

// Adding valid entry to result
function pushValid(acc, entry) {
  const start = standardizeTimestamp(entry.start);
  const end = standardizeTimestamp(entry.end);
  const { text } = entry;

  acc.validEntries.push({
    id: acc.currentIndex,
    timecode: `${start} --> ${end}`,
    startMicro: timecodeToMicroseconds(start),
    endMicro: timecodeToMicroseconds(end),
    text,
  });
  acc.currentIndex += 1;
  return acc;
}

function parseSrtEntries(subtitleText, options = optionDefault) {
  subtitleText = subtitleText.replace(/(\r\n|\r)/g, '\n');
  const potentialBlocksArray = subtitleText.match(potentialSrtBlockRegex);

  const { validEntries, status } = potentialBlocksArray.reduce((acc, cur) => {
    // remove indices and unwanted newlines
    cur = cur.replace(/\n\d+$/, '').replace(/\n{2,}/g, '\n').trim();
    // validate if timecode is valid/repairable and contains text
    if (!cur.match(validEntryRegex)) return pushInvalid(acc, cur, options);
    return pushValid(acc, cur.match(validEntryRegex).groups);
  }, resultInit);

  return { validEntries, status };
}

module.exports = parseSrtEntries;
