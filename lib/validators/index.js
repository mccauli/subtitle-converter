const parse = require('../parsers');
const validateStandardized = require('./standardizedJSON');

function validate(subtitleText, inputExtension, options) {
  // read inputFile, convert to standardized JSON format
  const { data, status: parseStatus } = parse(subtitleText, inputExtension, options);

  const outputStatus = validateStandardized(data.body, options);

  const success = parseStatus.success && outputStatus.success;
  const status = { ...parseStatus, ...outputStatus, success };
  return status;
}

module.exports = validate;
