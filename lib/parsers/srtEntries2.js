const { timecodeToMicroseconds } = require('../shared/utils');
const {
  potentialTimecodeRegex,
  potentialSrtBlockRegex,
  strictTimestampRegex,
  validEntryRegexGroups,
  emptyEntryRegex,
  validTimecodeRegex,
  firstIndexRegex,
} = require('../shared/srtParseRegex');

// Standardize timestamp to HH:MM:SS:mmm format
function standardizeTimestamp(timestamp) {
  if (strictTimestampRegex.test(timestamp)) return timestamp;
  // Fix separators
  return timestamp.replace(/[^\d]+/g, ':').replace(/:(?=\d{3})/, ',');
}

// Adding INVALID entry to result
function pushInvalid(acc, cur, options) {
  const invalidTimecode = cur.match(potentialTimecodeRegex)[0]; // Only first potential timecode of entry
  if (options.invalidTimecodes) acc.status.invalidTimecodes.push(invalidTimecode);
  if (options.invalidEntries) acc.status.invalidEntries.push(cur); // TODO: eliminate invalid Entires if possible
  acc.status.success = false;
  return acc;
}

// Adding VALID entry to result
function pushValid(acc, cur) {
  const entryGroups = cur.match(validEntryRegexGroups);
  const start = standardizeTimestamp(entryGroups[1]);
  const end = standardizeTimestamp(entryGroups[2]);
  const text = entryGroups[3];

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
  if (!potentialBlocksArray) {
    return {
      validEntries: ['No entries found.'],
      status: {
        success: false,
      },
    };
  }

  // If first index exists and it is non-digit, add to array for further evaluation
  // TODO: find better solution
  const firstindex = subtitleText.match(firstIndexRegex)[0].trim();
  if (!(/^\d+$/.test(firstindex)) && !!firstindex.length) {
    // Giving zero timestamp for other functions
    potentialBlocksArray.unshift(`00:00:00:00 --> 00:00:00:00\n${firstindex}`);
  }

  // Validating all entries and creating return objects
  const { validEntries, status } = potentialBlocksArray.reduce((acc, cur) => {
    // Remove indices and unwanted newlines
    cur = cur.replace(/\n\d+$/, '').replace(/\n{2,}/g, '\n').trim();

    // Check if timecode is valid/repairable
    if (!cur.match(validTimecodeRegex)) return pushInvalid(acc, cur, options);
    // Skip if entry has no text
    if (emptyEntryRegex.test(cur)) return acc;

    // Standardize timecode if needed, and return acc
    return pushValid(acc, cur);
  }, {
    currentIndex: 1,
    validEntries: [],
    status: {
      success: true,
      invalidEntries: [], // TODO: think about if needed.
      invalidTimecodes: [],
    },
  });
  console.log(validEntries, status);
  return { validEntries, status };
}

module.exports = parseSrtEntries;
