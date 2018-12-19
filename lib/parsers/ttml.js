const util = require('util');
const { readFile } = require('fs-extra');
const { parseString } = require('xml2js');

const parseXml = util.promisify(parseString);

async function ttml(subtitleFile) {
  const rawData = await readFile(subtitleFile, 'utf8');
  return parseXml(rawData);
}


module.exports = ttml;
