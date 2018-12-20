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
    throw new Error(`Timecode (${timecode}) contains frames, but no fps was specified.`);
  }

  return hoursToMicroseconds(parseInt(hours))
    + minutesToMicroseconds(parseInt(minutes))
    + secondsToMicroseconds(parseInt(seconds))
    + millisecondsToMicroseconds(parseInt(milliseconds))
    + framesToMicroseconds(parseInt(frames), parseFloat(fps));
}

module.exports = {
  timecodeToMicroseconds,
  millisecondsToMicroseconds,
};
