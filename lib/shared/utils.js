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

function microSecondsToMilliseconds(microseconds) {
  return microseconds / 1000;
}

function millisecondsToMicroseconds(milliseconds) {
  return milliseconds * 1000;
}

function secondsToMicroseconds(seconds) {
  return millisecondsToMicroseconds(seconds * 1000);
}

function minutesToMicroseconds(minutes) {
  return secondsToMicroseconds(minutes * 60);
}

function hoursToMicroseconds(hours) {
  return minutesToMicroseconds(hours * 60);
}

function framesToMicroseconds(frames, fps) {
  if (!frames || !fps) {
    return 0;
  }
  const seconds = frames / fps;
  return secondsToMicroseconds(seconds);
}

function timecodeToMicroseconds(timecode, fps) {
  const [hours, minutes, secondsAndMilliseconds, other] = timecode.replace(',', '.').split(':');
  const seconds = secondsAndMilliseconds.split('.')[0] || 0;
  const milliseconds = secondsAndMilliseconds.split('.')[1] || 0;
  const frames = seconds.split(';')[1] || other;

  if (frames && !fps) {
    throw Error(`Timecode (${timecode}) contains frames, but no fps was specified.`);
  }

  return hoursToMicroseconds(parseInt(hours))
    + minutesToMicroseconds(parseInt(minutes))
    + secondsToMicroseconds(parseInt(seconds))
    + millisecondsToMicroseconds(parseInt(milliseconds))
    + framesToMicroseconds(parseInt(frames), parseFloat(fps));
}

module.exports = {
  readFile,
  timecodeToMicroseconds,
  secondsToMicroseconds,
  millisecondsToMicroseconds,
  microSecondsToMilliseconds,
};
