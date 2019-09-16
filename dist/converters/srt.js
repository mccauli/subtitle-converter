"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('subtitles-parser'),
    toSrt = _require.toSrt;

var _require2 = require('../shared/utils'),
    microsecondsToMilliseconds = _require2.microsecondsToMilliseconds;

function format(subtitleJSON) {
  return subtitleJSON.body.map(function (line) {
    return {
      id: line.id,
      startTime: microsecondsToMilliseconds(line.startMicro),
      endTime: microsecondsToMilliseconds(line.endMicro),
      text: line.text
    };
  });
}

function srt(_x) {
  return _srt.apply(this, arguments);
}

function _srt() {
  _srt = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(subtitleJSON) {
    var formattedJSON;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formattedJSON = format(subtitleJSON);
            return _context.abrupt("return", toSrt(formattedJSON));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _srt.apply(this, arguments);
}

module.exports = srt;