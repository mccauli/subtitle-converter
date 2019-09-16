'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
  var seconds = frames / fps;
  return secondsToMicroseconds(seconds);
}

function timecodeToMicroseconds(timecode, fps) {
  var _timecode$replace$spl = timecode.replace(',', '.').split(':'),
      _timecode$replace$spl2 = _slicedToArray(_timecode$replace$spl, 4),
      hours = _timecode$replace$spl2[0],
      minutes = _timecode$replace$spl2[1],
      secondsAndMilliseconds = _timecode$replace$spl2[2],
      other = _timecode$replace$spl2[3];

  var seconds = secondsAndMilliseconds.split('.')[0] || 0;
  var milliseconds = secondsAndMilliseconds.split('.')[1] || 0;
  var frames = seconds.split(';')[1] || other;

  if (frames && !fps) {
    throw Error('Timecode (' + timecode + ') contains frames, but no fps was specified.');
  }

  return hoursToMicroseconds(parseInt(hours)) + minutesToMicroseconds(parseInt(minutes)) + secondsToMicroseconds(parseInt(seconds)) + millisecondsToMicroseconds(parseInt(milliseconds)) + framesToMicroseconds(parseInt(frames), parseFloat(fps));
}

function extractStyling(text) {
  var unformattedText = '';
  if (text.search(/<br>/) && !text.startsWith('<br>')) {
    unformattedText = text.replace(/<br>/, '\n');
  }
  var formattingTags = unformattedText.match(/<[^>]*>|{[^}]*}/g);
  if (formattingTags && formattingTags.length) {
    formattingTags.forEach(function (tag) {
      if (tag.search(/{[^}]*}/) > -1) {
        unformattedText = unformattedText.replace(tag, ' ').replace(/\s\s+/, ' ');
      } else {
        unformattedText = unformattedText.replace(tag, '');
      }
    });
  }
  return unformattedText.trim();
}

function cleanUpText(text) {
  var removeTextFormatting = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var newText = text.replace(/[\n]+/g, '\n').trim();
  if (removeTextFormatting) {
    newText = extractStyling(newText);
  }
  return newText;
}

// eslint-disable-next-line complexity
function fixTimecodeOverlap(line, prevLine) {
  var timecodeOverlapLimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!prevLine || timecodeOverlapLimiter === false) {
    return line;
  }
  // auto fix timecode overlap when the overlap is less than one second
  var difference = parseInt(prevLine.endMicro - line.startMicro);
  var limiter = timecodeOverlapLimiter * 1000000;
  var overlap = line.startMicro < prevLine.endMicro;
  var autoFix = difference <= limiter;

  if (overlap && autoFix) {
    line.startMicro = prevLine.endMicro;
  } else if (overlap && !autoFix) {
    throw Error('SRT timecode overlap on lines ' + prevLine.id + ' and ' + line.id + ' is too high ' + ('to automatically fix (' + difference / 1000000 + ' seconds). To fix this overlap anyway, set option ') + 'timecodeOverlapLimiter to true');
  }
  return line;
}

module.exports = {
  timecodeToMicroseconds: timecodeToMicroseconds,
  secondsToMicroseconds: secondsToMicroseconds,
  millisecondsToMicroseconds: millisecondsToMicroseconds,
  microsecondsToMilliseconds: microsecondsToMilliseconds,
  microsecondsToSeconds: microsecondsToSeconds,
  cleanUpText: cleanUpText,
  fixTimecodeOverlap: fixTimecodeOverlap
};