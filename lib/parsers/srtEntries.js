/* eslint-disable complexity */
const { timecodeToMicroseconds } = require('../shared/utils');

function parseSrtEntries(subtitle, options = {
  invalidEntries: true,
  invalidTimecodes: true,
}) {
  // Line breaks are OS dependent
  // MAC  - \r
  // UNIX - \n
  // WIN  - \r\n
  // Standardize files by replacing all line breaks with \n

  // Turn all \r to \r\n
  // Note: \r\n will turn into \r\n\n - extra \n to be removed later
  const carriaged = subtitle.replace(/\r/g, '\r\n');

  // Remove all \r to leave just \n
  const newlined = carriaged.replace(/\r/g, '');

  // Remove extra \n between lines
  const splitText = /.\n{2,}/g;
  const squeezed = newlined.replace(splitText, (text) => text.replace(/\n{2,}/g, '\n'));

  // Add breaks between text and indices
  // Index is assumed to be a line with only digits (\d+\n)
  const unbuffered = /.\n\d+\n/g;
  const buffered = squeezed.replace(unbuffered, (text) => text.replace('\n', '\n\n'));

  // Collect valid entries and timecode errors
  const validEntry = /^\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n(.|\n)+/;
  const validTimecode = /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/;

  const isIndex = /^\d+$/;
  const isTimecode = /-->/;

  const validEntries = [];
  const status = {
    success: true,
    invalidEntries: [],
    invalidTimecodes: [],
  };

  const entries = buffered.split(/\n\n/g);
  entries.forEach(entry => {
    const trimmed = entry.trim();
    if (!trimmed) return; // if no value continue

    if (validEntry.test(trimmed)) {
      const valid = trimmed.split('\n');
      const timecode = valid[1];
      const times = timecode.split(validTimecode);

      validEntries.push({
        id: valid[0],
        timecode,
        startMicro: timecodeToMicroseconds(times[1]),
        endMicro: timecodeToMicroseconds(times[2]),
        text: valid.slice(2).join('\n'),
      });
    } else {
      // invalid
      const invalid = trimmed.split('\n');

      let id;
      let timecode;
      const text = [];
      invalid.forEach(line => {
        if (isIndex.test(line)) id = line;
        else if (isTimecode.test(line)) timecode = line;
        else text.push(line);
      });

      // remove valid entry with missing text
      if (isIndex.test(id) && validTimecode.test(timecode)) return;

      if (options.invalidTimecodes && !validTimecode.test(timecode)) {
        status.invalidTimecodes.push({
          id,
          timecode,
        });
      }

      if (options.invalidEntries) {
        status.invalidEntries.push({
          id,
          timecode,
          text: text.join('\n'),
        });
      }

      status.success = false;
    }
  });
  return { validEntries, status };
}

module.exports = parseSrtEntries;
