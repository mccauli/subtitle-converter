"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('node-webvtt'),
    compile = _require.compile;

var _require2 = require('../shared/utils'),
    microsecondsToSeconds = _require2.microsecondsToSeconds;

function format(subtitleJSON) {
  return {
    valid: true,
    cues: subtitleJSON.body.map(function (line) {
      var styles = line.styles ? Object.keys(line.styles).map(function (key) {
        return "".concat(key, ":").concat(line.styles[key]);
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

function vtt(_x) {
  return _vtt.apply(this, arguments);
}

function _vtt() {
  _vtt = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(subtitleJSON) {
    var formattedJSON;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formattedJSON = format(subtitleJSON);
            return _context.abrupt("return", compile(formattedJSON));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _vtt.apply(this, arguments);
}

module.exports = vtt;