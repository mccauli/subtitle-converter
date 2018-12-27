const fs = require('fs-extra');
const { toSrt } = require('subtitles-parser');
const { microsecondsToMilliseconds } = require('../shared/utils');

function format(subtitleJSON) {
  return subtitleJSON.body.map(line => ({
    id: line.id,
    startTime: microsecondsToMilliseconds(line.startMicro),
    endTime: microsecondsToMilliseconds(line.endMicro),
    text: line.text,
  }));
}

async function srt(subtitleJSON, convertedFilename) {
  const formattedJSON = format(subtitleJSON);
  const subtitleText = toSrt(formattedJSON);
  await fs.writeFile(convertedFilename, subtitleText, 'UTF-8');
  return convertedFilename;
}

module.exports = srt;
