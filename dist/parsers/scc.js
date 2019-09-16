'use strict';

var scc = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subtitleText, options) {
    var lines, subtitleJSON, _Joi$validate, error, value;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            lines = subtitleText.split(/\r\n|\n/);
            _context.next = 3;
            return sccToJSON(lines);

          case 3:
            subtitleJSON = _context.sent;
            _Joi$validate = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA), error = _Joi$validate.error, value = _Joi$validate.value;

            if (!error) {
              _context.next = 7;
              break;
            }

            throw Error(error);

          case 7:
            return _context.abrupt('return', value);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function scc(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Joi = require('joi-browser');
var util = require('util');

var _require = require('../shared/constants'),
    SUBTITLE_SCHEMA = _require.SUBTITLE_SCHEMA;

var _require2 = require('../shared/utils'),
    cleanUpText = _require2.cleanUpText,
    fixTimecodeOverlap = _require2.fixTimecodeOverlap;

var _require3 = require('./scc_to_json'),
    toJSON = _require3.toJSON;

var sccToJSON = util.promisify(toJSON);

function standardize(subtitleJSON, options) {
  var removeTextFormatting = options.removeTextFormatting,
      timecodeOverlapLimiter = options.timecodeOverlapLimiter;

  var prevLine = '';
  return {
    global: {},
    body: subtitleJSON.map(function (line) {
      return {
        id: line.id,
        startMicro: line.startTimeMicro,
        endMicro: line.endTimeMicro,
        captions: {
          frames: line.frames,
          popOn: line.popOn,
          paintOn: line.paintOn,
          rollUpRows: line.rollUpRows,
          commands: line.commands
        },
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

module.exports = scc;