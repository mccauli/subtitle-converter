'use strict';

var dfxp = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subtitleText, options) {
    var subtitleJSON, _Joi$validate, error, value;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return parseXml(subtitleText);

          case 2:
            subtitleJSON = _context.sent;
            _Joi$validate = Joi.validate(standardize(subtitleJSON, options), SUBTITLE_SCHEMA), error = _Joi$validate.error, value = _Joi$validate.value;

            if (!error) {
              _context.next = 6;
              break;
            }

            throw Error(error);

          case 6:
            return _context.abrupt('return', value);

          case 7:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function dfxp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var util = require('util');

var _require = require('xml2js'),
    parseString = _require.parseString;

var Joi = require('joi-browser');
var R = require('ramda');

var _require2 = require('../shared/constants'),
    SUBTITLE_SCHEMA = _require2.SUBTITLE_SCHEMA;

var _require3 = require('../shared/utils'),
    timecodeToMicroseconds = _require3.timecodeToMicroseconds,
    cleanUpText = _require3.cleanUpText,
    fixTimecodeOverlap = _require3.fixTimecodeOverlap;

var parseXml = util.promisify(parseString);

function standardize(subtitleJSON, options) {
  var removeTextFormatting = options.removeTextFormatting,
      timecodeOverlapLimiter = options.timecodeOverlapLimiter;

  var prevLine = '';
  var global = R.path(['tt', '$'], subtitleJSON);
  var body = R.path(['tt', 'body', '0', 'div', '0', 'p'], subtitleJSON);
  return {
    global: {
      language: global['xml:lang']
    },
    body: body.map(function (line, index) {
      return {
        id: index.toString(),
        startMicro: timecodeToMicroseconds(R.path(['$', 'begin'], line)),
        endMicro: timecodeToMicroseconds(R.path(['$', 'end'], line)),
        text: cleanUpText(line._, removeTextFormatting)
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

module.exports = dfxp;