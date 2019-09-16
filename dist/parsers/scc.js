"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Joi = require('joi-browser');

var _require = require('../shared/constants'),
    SUBTITLE_SCHEMA = _require.SUBTITLE_SCHEMA;

var _require2 = require('../shared/utils'),
    cleanUpText = _require2.cleanUpText,
    fixTimecodeOverlap = _require2.fixTimecodeOverlap;
/**
* Converts the SCC file to a proprietary JSON format
* @function
* @param {string} data - Entire SCC file content
* @public
*/


function sccToJSON(_x, _x2) {
  return _sccToJSON.apply(this, arguments);
}

function _sccToJSON() {
  _sccToJSON = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(lines, callback) {
    var idx;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            idx = 0;
            jsonCaptions = [];

            for (idx = 0; idx < lines.length; idx++) {
              if (!module.exports.verify(lines[idx])) {
                module.exports.translateLine(lines[idx].toLowerCase());
              }
            }

            if (paintBuffer.length > 0) {
              rollUp(true);
            }

            if (jsonCaptions[jsonCaptions.length - 1]) {
              _context.next = 7;
              break;
            }

            callback('Failed to convert SCC data');
            return _context.abrupt("return");

          case 7:
            if (jsonCaptions[jsonCaptions.length - 1].endTimeMicro === undefined) {
              jsonCaptions[jsonCaptions.length - 1].endTimeMicro = jsonCaptions[jsonCaptions.length - 1].startTimeMicro;
            }

            callback(null, jsonCaptions);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sccToJSON.apply(this, arguments);
}

;

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

function scc(_x3, _x4) {
  return _scc.apply(this, arguments);
}

function _scc() {
  _scc = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(subtitleText, options) {
    var lines, subtitleJSON, _Joi$validate, error, value;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            lines = subtitleText.split(/\r\n|\n/);
            _context2.next = 3;
            return sccToJSON(lines);

          case 3:
            subtitleJSON = _context2.sent;
            _Joi$validate = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA), error = _Joi$validate.error, value = _Joi$validate.value;

            if (!error) {
              _context2.next = 7;
              break;
            }

            throw Error(error);

          case 7:
            return _context2.abrupt("return", value);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _scc.apply(this, arguments);
}

module.exports = scc;