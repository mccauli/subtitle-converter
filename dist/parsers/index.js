"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var dfxp = require('./dfxp');

var scc = require('./scc');

var srt = require('./srt');

var ttml = require('./ttml');

var vtt = require('./vtt');

function stringToJson(_x, _x2, _x3) {
  return _stringToJson.apply(this, arguments);
}

function _stringToJson() {
  _stringToJson = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(subtitleText, fileExtension, options) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = fileExtension;
            _context.next = _context.t0 === '.dfxp' ? 3 : _context.t0 === '.scc' ? 4 : _context.t0 === '.srt' ? 5 : _context.t0 === '.ttml' ? 6 : _context.t0 === '.vtt' ? 7 : 8;
            break;

          case 3:
            return _context.abrupt("return", dfxp(subtitleText, options));

          case 4:
            return _context.abrupt("return", scc(subtitleText, options));

          case 5:
            return _context.abrupt("return", srt(subtitleText, options));

          case 6:
            return _context.abrupt("return", ttml(subtitleText, options));

          case 7:
            return _context.abrupt("return", vtt(subtitleText, options));

          case 8:
            throw Error("File type ".concat(fileExtension, " is not supported. Supported input file types include:\n") + 'dfxp, scc, srt, ttml, and vtt');

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _stringToJson.apply(this, arguments);
}

function parse(_x4, _x5, _x6) {
  return _parse.apply(this, arguments);
}

function _parse() {
  _parse = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(subtitleText, inputExtension, options) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            return _context2.abrupt("return", stringToJson(subtitleText, inputExtension, options));

          case 4:
            _context2.prev = 4;
            _context2.t0 = _context2["catch"](0);
            throw Error(_context2.t0);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return _parse.apply(this, arguments);
}

module.exports = parse;