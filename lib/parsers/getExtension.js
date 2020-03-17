const { EXTENSION_REGEX } = require('../shared/extensionRegex');

function getExtension(subtitle) {
  let result;

  EXTENSION_REGEX.some(extension => {
    if (extension.regex.test(subtitle)) result = extension.extension;
    return !!result;
  });
  return result;
}

module.exports = { getExtension };
