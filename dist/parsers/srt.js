'use strict';

var srt = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subtitleText, options) {
    var subtitleJSON, _Joi$validate, error, value;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            subtitleJSON = fromSrt(subtitleText, true);
            _Joi$validate = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA), error = _Joi$validate.error, value = _Joi$validate.value;

            if (!error) {
              _context.next = 4;
              break;
            }

            throw Error(error);

          case 4:
            return _context.abrupt('return', value);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function srt(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('subtitles-parser'),
    fromSrt = _require.fromSrt;

var Joi = require('joi-browser');

var _require2 = require('../shared/constants'),
    SUBTITLE_SCHEMA = _require2.SUBTITLE_SCHEMA;

var _require3 = require('../shared/utils'),
    millisecondsToMicroseconds = _require3.millisecondsToMicroseconds,
    cleanUpText = _require3.cleanUpText,
    fixTimecodeOverlap = _require3.fixTimecodeOverlap;

function standardize(subtitleJSON, options) {
  var removeTextFormatting = options.removeTextFormatting,
      timecodeOverlapLimiter = options.timecodeOverlapLimiter;

  var prevLine = '';
  return {
    global: {},
    body: subtitleJSON.map(function (line) {
      return {
        id: line.id,
        startMicro: millisecondsToMicroseconds(line.startTime),
        endMicro: millisecondsToMicroseconds(line.endTime),
        text: cleanUpText(line.text, removeTextFormatting)
      };
    }).filter(function (line) {
      return line.text;
    }).map(function (line, index) {
      // if empty lines were deleted, we need to make sure the id is in sequential order
      line.id = (index + 1).toString();
      var newLine = fixTimecodeOverlap(line, prevLine, timecodeOverlapLimiter);
      prevLine = newLine;
      return newLine;
    }),
    source: subtitleJSON
  };
}

module.exports = srt;