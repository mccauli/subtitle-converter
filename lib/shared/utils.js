function microsecondsToMilliseconds(microseconds) {
  return microseconds / 1000;
}

function microsecondsToSeconds(microseconds) {
  return microsecondsToMilliseconds(microseconds / 1000);
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

function extractStyling(text) {
  let unformattedText = '';
  if (text.search(/<br>/) && !text.startsWith('<br>')) {
    unformattedText = text.replace(/<br>/, '\n');
  }
  const formattingTags = unformattedText.match(/<[^>]*>|{[^}]*}/g);
  if (formattingTags && formattingTags.length) {
    formattingTags.forEach(tag => {
      if (tag.search(/{[^}]*}/) > -1) {
        unformattedText = unformattedText.replace(tag, ' ').replace(/\s\s+/, ' ');
      } else {
        unformattedText = unformattedText.replace(tag, '');
      }
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

// eslint-disable-next-line complexity
function fixTimecodeOverlap(line, prevLine, timecodeOverlapLimiter = false) {
  if (!prevLine || timecodeOverlapLimiter === false) {
    return line;
  }
  // auto fix timecode overlap when the overlap is less than one second
  const difference = parseInt(prevLine.endMicro - line.startMicro);
  const limiter = timecodeOverlapLimiter * 1000000;
  const overlap = line.startMicro < prevLine.endMicro;
  const autoFix = difference <= limiter;

  if (overlap && autoFix) {
    line.startMicro = prevLine.endMicro;
  } else if (overlap && !autoFix) {
    const seconds = difference / 1000000;
    throw Error(`SRT timecode overlap on lines ${prevLine.id} and ${line.id} is too high `
    + `to automatically fix (${seconds} seconds). To fix this overlap, set option `
    + `timecodeOverlapLimiter to greater than ${seconds} seconds`, line.id);
  }
  return line;
}

module.exports = {
  timecodeToMicroseconds,
  secondsToMicroseconds,
  millisecondsToMicroseconds,
  microsecondsToMilliseconds,
  microsecondsToSeconds,
  hoursToMicroseconds,
  cleanUpText,
  fixTimecodeOverlap,
};
