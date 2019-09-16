'use strict';

var srt = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subtitleJSON) {
    var formattedJSON;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formattedJSON = format(subtitleJSON);
            return _context.abrupt('return', toSrt(formattedJSON));

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function srt(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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

module.exports = srt;