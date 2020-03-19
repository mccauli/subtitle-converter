const { EXTENSION_REGEX } = require('../shared/extensionRegex');

/**
 * @function Checks if input file is potentially any of the following
 *           subitle files: .srt, .vtt, .scc, .ttml(same as .dfxp).
 * @param {string}  subtitle  The utf-8 buffer of any file type.
 * @return {string} One of the extensions mentioned in the description
 * @access public
 */

function getExtension(subtitle) {
  let result;

  EXTENSION_REGEX.some(extension => {
    if (extension.regex.test(subtitle)) result = extension.extension;
    return !!result;
  });
  return result;
}

module.exports = { getExtension };
