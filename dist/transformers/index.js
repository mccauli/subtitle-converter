"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var shiftTimecodeByFps = require('./fps_standard_conversion');

var shiftTimecodeBySeconds = require('./shift_subtitle_timecode');

function transform(_x, _x2) {
  return _transform.apply(this, arguments);
}

function _transform() {
  _transform = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(data, options) {
    var shiftTimecode, sourceFps, outputFps;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            shiftTimecode = options.shiftTimecode, sourceFps = options.sourceFps, outputFps = options.outputFps;

            if (shiftTimecode) {
              data.body = shiftTimecodeBySeconds(data.body, shiftTimecode);
            }

            if (sourceFps && outputFps) {
              data.body = shiftTimecodeByFps(data.body, sourceFps, outputFps);
            }

            return _context.abrupt("return", data);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _transform.apply(this, arguments);
}

module.exports = transform;