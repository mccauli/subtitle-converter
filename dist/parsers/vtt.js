"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('node-webvtt'),
    parse = _require.parse;

var Joi = require('joi-browser');

var _require2 = require('../shared/constants'),
    SUBTITLE_SCHEMA = _require2.SUBTITLE_SCHEMA;

var _require3 = require('../shared/utils'),
    secondsToMicroseconds = _require3.secondsToMicroseconds,
    cleanUpText = _require3.cleanUpText,
    fixTimecodeOverlap = _require3.fixTimecodeOverlap;

function standardize(subtitleJSON, options) {
  var removeTextFormatting = options.removeTextFormatting,
      timecodeOverlapLimiter = options.timecodeOverlapLimiter;
  var prevLine = '';
  return {
    global: {},
    body: subtitleJSON.cues.map(function (line, index) {
      var styles = line.styles.split(' ').reduce(function (obj, style) {
        var _style$split = style.split(':'),
            _style$split2 = _slicedToArray(_style$split, 2),
            key = _style$split2[0],
            value = _style$split2[1];

        obj[key] = value;
        return obj;
      }, {});
      return {
        id: index.toString(),
        startMicro: secondsToMicroseconds(line.start),
        endMicro: secondsToMicroseconds(line.end),
        styles: styles,
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

function vtt(_x, _x2) {
  return _vtt.apply(this, arguments);
}

function _vtt() {
  _vtt = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(subtitleText, options) {
    var subtitleJSON, _Joi$validate, error, value;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return parse(subtitleText);

          case 2:
            subtitleJSON = _context.sent;
            _Joi$validate = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA), error = _Joi$validate.error, value = _Joi$validate.value;

            if (!error) {
              _context.next = 6;
              break;
            }

            throw Error(error);

          case 6:
            return _context.abrupt("return", value);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _vtt.apply(this, arguments);
}

module.exports = vtt;