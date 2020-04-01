const { timecodeToMicroseconds } = require('../shared/utils');
const {
  potentialTimecodeRegex,
  potentialSrtBlockRegex,
  strictTimestampRegex,
  validEntryRegex,
  emptyEntryRegex,
  validTimecodeRegex,
} = require('../shared/srtParseRegex');

// Standardize timestamp to HH:MM:SS:mmm format
function standardizeTimestamp(timestamp) {
  if (strictTimestampRegex.test(timestamp)) return timestamp;
  // Fix separators
  timestamp = timestamp.replace(/[^\d]+/g, ':').replace(/:(?=\d{3})/, ',');
  // Add zero in front of single digits
  return timestamp.replace(/^(?=\d[:,])/, '0').replace(/:(?=\d[:,])/g, ':0');
}

// Adding INVALID entry to result
function pushInvalid(acc, cur, options) {
  const invalidTimecode = cur.match(potentialTimecodeRegex)[0]; // Only first potential timecode of entry
  if (options.invalidTimecodes) acc.status.invalidTimecodes.push(invalidTimecode);
  if (options.invalidEntries) acc.status.invalidEntries.push(cur); // TODO: do we really need to make it an object?
  acc.status.success = false;
  return acc;
}

// Adding VALID entry to result
function pushValid(acc, entry) {
  const start = standardizeTimestamp(entry.start);
  const end = standardizeTimestamp(entry.end);
  const { text } = entry;

  acc.validEntries.push({
    id: acc.currentIndex.toString(),
    timecode: `${start} --> ${end}`,
    startMicro: timecodeToMicroseconds(start),
    endMicro: timecodeToMicroseconds(end),
    text,
  });
  acc.currentIndex += 1;
  return acc;
}

function parseSrtEntries(subtitleText, options = {
  invalidEntries: true,
  invalidTimecodes: true,
}) {
  // Translating line breaks from all OS'
  subtitleText = subtitleText.replace(/(\r\n|\r)/g, '\n');

  // Creating an array with all potential entries
  const potentialBlocksArray = subtitleText.match(potentialSrtBlockRegex);

  // Validating all entries and creating return objects
  const { validEntries, status } = potentialBlocksArray.reduce((acc, cur) => {
    // Remove indices and unwanted newlines
    cur = cur.replace(/\n\d+$/, '').replace(/\n{2,}/g, '\n').trim();

    // Check if timecode is valid/repairable
    if (!cur.match(validTimecodeRegex)) return pushInvalid(acc, cur, options);

    // Skip if entry has no text
    if (emptyEntryRegex.test(cur)) return acc;

    // Standardize timecode if needed, and return acc
    return pushValid(acc, cur.match(validEntryRegex).groups);
  }, {
    currentIndex: 1,
    validEntries: [],
    status: {
      success: true,
      invalidEntries: [],
      invalidTimecodes: [],
    },
  });
  return { validEntries, status };
}

module.exports = parseSrtEntries;
