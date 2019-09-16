'use strict';

var transform = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data, options) {
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
            return _context.abrupt('return', data);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function transform(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var shiftTimecodeByFps = require('./fps_standard_conversion');
var shiftTimecodeBySeconds = require('./shift_subtitle_timecode');

module.exports = transform;