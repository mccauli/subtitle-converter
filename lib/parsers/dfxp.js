const util = require('util');
const { parseString } = require('xml2js');

const parseXml = util.promisify(parseString);

async function dfxp(subtitleText) {
  return parseXml(subtitleText);
}

module.exports = dfxp;
