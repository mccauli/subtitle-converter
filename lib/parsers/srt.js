const { fromSrt } = require('subtitles-parser');
const Joi = require('joi');
const { JSON_SCHEMA } = require('../shared/constants');
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

function standardize(subtitleJSON, removeTextFormatting = false) {
  return {
    global: {},
    body: subtitleJSON.map(line => ({
      id: line.id,
      start_micro: millisecondsToMicroseconds(line.startTime),
      end_micro: millisecondsToMicroseconds(line.endTime),
      text: removeTextFormatting ? extractStyling(line.text.trim()) : line.text.trim(),
    })).filter(line => line.text),
    source: subtitleJSON,
  };
}

async function srt(subtitleText, options = {}) {
  const subtitleJSON = fromSrt(subtitleText, true);
  const { error, value } = Joi.validate(standardize(subtitleJSON, options.removeTextFormatting), JSON_SCHEMA);
  if (error) {
    throw new Error(error);
  }
  return value;
}

module.exports = srt;
