const fs = require('fs-extra');
const { toSrt } = require('subtitles-parser');

function format(subtitleJSON) {
  return subtitleJSON.body.map(line => ({
    id: line.id,
    startTime: line.start_micro,
    endTime: line.end_micro,
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
