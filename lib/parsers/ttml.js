const util = require('util');
const { parseString } = require('xml2js');

const parseXml = util.promisify(parseString);

async function ttml(subtitleText) {
  return parseXml(subtitleText);
}


module.exports = ttml;
