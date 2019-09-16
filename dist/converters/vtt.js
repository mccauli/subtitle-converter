'use strict';

var vtt = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subtitleJSON) {
    var formattedJSON;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formattedJSON = format(subtitleJSON);
            return _context.abrupt('return', compile(formattedJSON));

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function vtt(_x) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('node-webvtt'),
    compile = _require.compile;

var _require2 = require('../shared/utils'),
    microsecondsToSeconds = _require2.microsecondsToSeconds;

function format(subtitleJSON) {
  return {
    valid: true,
    cues: subtitleJSON.body.map(function (line) {
      var styles = line.styles ? Object.keys(line.styles).map(function (key) {
        return key + ':' + line.styles[key];
      }).join(' ') : '';
      return {
        identifier: line.id,
        start: microsecondsToSeconds(line.startMicro),
        end: microsecondsToSeconds(line.endMicro),
        text: line.text,
        styles: styles
      };
    })
  };
}

module.exports = vtt;