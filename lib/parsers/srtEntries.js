const { timecodeToMicroseconds } = require('../shared/utils');
const {
  potentialIndexRegex,
  potentialTimecodeRegex,
  potentialSrtBlockRegex,
  invalidFirstEntryRegex,
  validTimecodeRegex,
  emptyEntryRegex,
  validEntryRegexGroups,
  strictTimestampRegex,
} = require('./srtEntriesRegex');

/**
 * Functions for parseSrtEntries
 */
function standardizeTimestamp(timestamp) {
  if (strictTimestampRegex.test(timestamp)) return timestamp;
  return timestamp.replace(/[^\d]+/g, ':').replace(/:(?=\d{3})/, ','); // HH:MM:SS,mmm format
}

function pushInvalidEntry(acc, cur, options) {
  const invalidTimecode = cur.match(potentialTimecodeRegex)[0]; // Only first potential timecode of entry
  if (options.invalidTimecodes) acc.status.invalidTimecodes.push(invalidTimecode);
  if (options.invalidEntries) acc.status.invalidEntries.push(cur);
  acc.status.success = false;
  return acc;
}

function pushValidEntry(acc, cur) {
  // Capturing groups indicated in srtEntriesRegex.js
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

/**
 * Main function of srtEntries.js
 */
function parseSrtEntries(subtitleText, options = { invalidEntries: true, invalidTimecodes: true }) {
  // Initalizing result object
  const result = {
    validEntries: [],
    status: {
      success: true,
      invalidEntries: [],
      invalidTimecodes: [],
      invalidIndices: [],
    },
  };

  // Standardizing line breaks from all OS -  MAC: '\r', UNIX: '\n', WIN '\r\n'
  subtitleText = subtitleText.replace(/(\r\n|\r)/g, '\n');

  // Creating an array with all potential entries
  const potentialBlocksArray = subtitleText.match(potentialSrtBlockRegex);

  if (!potentialBlocksArray) {
    result.validEntries.push('No entries found.');
    result.status.success = false;
    return result;
  }

  // If there is a first entry without timecode that is not an index
  const invalidFirstEntry = subtitleText.match(invalidFirstEntryRegex)[0].trim();
  if (invalidFirstEntry.length > 0) {
    result.status.invalidEntries.push(invalidFirstEntry);
    result.status.success = false;
  }

  // Validating all entries and creating return objects
  const { validEntries, status } = potentialBlocksArray.reduce((acc, cur) => {
    // Remove excessive newlines
    cur = cur.replace(/\n{2,}/g, '\n').trim();

    // Check if index exist and valid
    const potentialIndex = cur.match(potentialIndexRegex);
    if (potentialIndex && !(/\d+/.test(potentialIndex))) {
      acc.status.invalidIndices.push(potentialIndex);
      acc.status.success = false;
    }

    // Check if timecode is valid/repairable
    if (!cur.match(validTimecodeRegex)) return pushInvalidEntry(acc, cur, options);

    // Skip if entry has no text
    if (emptyEntryRegex.test(cur)) return acc;

    // Standardize timecode if needed, and push valid entry
    return pushValidEntry(acc, cur);
  }, { currentIndex: 1, ...result });

  return { validEntries, status };
}

module.exports = parseSrtEntries;
