const fs = require('fs-extra');
const { compile } = require('node-webvtt');
const { microsecondsToSeconds } = require('../shared/utils');

function format(subtitleJSON) {
  return {
    valid: true,
    cues: subtitleJSON.body.map(line => {
      const styles = line.styles
        ? Object.keys(line.styles)
          .map(key => `${key}:${line.styles[key]}`)
          .join(' ')
        : '';
      return {
        identifier: line.id,
        start: microsecondsToSeconds(line.startMicro),
        end: microsecondsToSeconds(line.endMicro),
        text: line.text,
        styles,
      };
    }),
  };
}

async function vtt(subtitleJSON, convertedFilename) {
  const formattedJSON = format(subtitleJSON);
  const subtitleText = compile(formattedJSON);
  await fs.writeFile(convertedFilename, subtitleText, 'UTF-8');
  return convertedFilename;
}

module.exports = vtt;
