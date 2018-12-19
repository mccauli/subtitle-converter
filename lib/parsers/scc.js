const util = require('util');
const { scc: { toJSON } } = require('node-captions');

const sccToJSON = util.promisify(toJSON);

async function scc(subtitleText) {
  const lines = subtitleText.split(/\r\n|\n/);
  return sccToJSON(lines);
}

module.exports = scc;
