"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Joi = require('joi-browser');

var parse = require('../parsers');

var transform = require('../transformers');

var srt = require('./srt');

var vtt = require('./vtt');

var _require = require('../shared/constants'),
    PARAM_SCHEMA = _require.PARAM_SCHEMA;

function generateOutputData(_x, _x2) {
  return _generateOutputData.apply(this, arguments);
}

function _generateOutputData() {
  _generateOutputData = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(jsonData, outputExtension) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = outputExtension;
            _context.next = _context.t0 === '.srt' ? 3 : _context.t0 === '.vtt' ? 4 : 5;
            break;

          case 3:
            return _context.abrupt("return", srt(jsonData));

          case 4:
            return _context.abrupt("return", vtt(jsonData));

          case 5:
            throw Error("File type ".concat(outputExtension, " is not supported. Supported output file types include:\n") + 'srt');

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _generateOutputData.apply(this, arguments);
}

function convert(_x3, _x4, _x5, _x6) {
  return _convert.apply(this, arguments);
}

function _convert() {
  _convert = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(subtitleText, inputExtension, outputExtension, options) {
    var _Joi$validate, validationError, data, transformedData;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!options) {
              options = {};
            } // validate input options


            _Joi$validate = Joi.validate({
              subtitleText: subtitleText,
              inputExtension: inputExtension,
              outputExtension: outputExtension,
              options: options
            }, PARAM_SCHEMA), validationError = _Joi$validate.error;

            if (!validationError) {
              _context2.next = 4;
              break;
            }

            throw Error(validationError);

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return parse(subtitleText, inputExtension, outputExtension, options);

          case 7:
            data = _context2.sent;
            _context2.next = 10;
            return transform(data, options);

          case 10:
            transformedData = _context2.sent;
            return _context2.abrupt("return", generateOutputData(transformedData, outputExtension));

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](4);
            throw Error(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 14]]);
  }));
  return _convert.apply(this, arguments);
}

module.exports = convert;