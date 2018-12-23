const { fromSrt } = require('subtitles-parser');
const Joi = require('joi');
const { SUBTITLE_SCHEMA } = require('../shared/constants');
const { millisecondsToMicroseconds } = require('../shared/utils');

function extractStyling(text) {
  let unformattedText = '';
  if (text.search(/<br>/) && !text.startsWith('<br>')) {
    unformattedText = text.replace(/<br>/, '\n');
  }
  const formattingTags = unformattedText.match(/<[^>]*>/g);
  if (formattingTags && formattingTags.length) {
    formattingTags.forEach(tag => {
      unformattedText = unformattedText.replace(tag, '');
    });
  }
  return unformattedText.trim();
}

function cleanUpText(text, removeTextFormatting = false) {
  let newText = text.replace(/[\n]+/g, '\n').trim();
  if (removeTextFormatting) {
    newText = extractStyling(newText);
  }
  return newText;
}

function fixTimecodeOverlap(line, prevLine, forceFixTimecodeOverlap = false) {
  if (!prevLine) {
    return line;
  }
  // auto fix timecode overlap when the overlap is less than one second
  const difference = parseInt(prevLine.endMicro - line.startMicro);
  const limiter = 1000000;
  const overlap = line.startMicro < prevLine.endMicro;
  const autoFix = forceFixTimecodeOverlap || difference <= limiter;

  if (overlap && autoFix) {
    line.startMicro = prevLine.endMicro;
  } else if (overlap && !autoFix) {
    throw Error(`SRT timecode overlap on lines ${prevLine.id} and ${line.id} is too high ` +
      `to automatically fix (${difference / 1000000} seconds). To fix this overlap anyway, set option ` +
      'forceFixTimecodeOverlap to true');
  }
  return line;
}

function standardize(subtitleJSON, options) {
  const { removeTextFormatting, forceFixTimecodeOverlap } = options;
  let prevLine = '';
  return {
    global: {},
    body: subtitleJSON
      .map(line => ({
        id: line.id,
        startMicro: millisecondsToMicroseconds(line.startTime),
        endMicro: millisecondsToMicroseconds(line.endTime),
        text: cleanUpText(line.text, removeTextFormatting),
      }))
      .filter(line => line.text)
      .map((line, index) => {
        // if empty lines were deleted, we need to make sure the id is in sequential order
        line.id = (index + 1).toString();
        const newLine = fixTimecodeOverlap(line, prevLine, forceFixTimecodeOverlap);
        prevLine = newLine;
        return newLine;
      }),
    source: subtitleJSON,
  };
}

async function srt(subtitleText, options) {
  const subtitleJSON = fromSrt(subtitleText, true);
  const { error, value } = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA);
  if (error) {
    throw Error(error);
  }
  return value;
}

module.exports = srt;
