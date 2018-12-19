const fs = require('fs-extra');
const detect = require('charset-detector');
const { convert } = require('encoding');

function detectTextEncoding(buffer) {
  return detect(buffer)[0].charsetName;
}

function bufferToString(buffer) {
  return buffer.toString().trim();
}

async function readFile(subtitleFile) {
  const buffer = await fs.readFile(subtitleFile);
  const encoding = detectTextEncoding(buffer);
  if (!encoding || encoding === 'UTF-8') {
    return bufferToString(buffer);
  }
  const convertedBuffer = convert(buffer, 'UTF-8', encoding);

  return bufferToString(convertedBuffer);
}

module.exports = readFile;
