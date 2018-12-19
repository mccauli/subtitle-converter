const util = require('util');
const { scc: { read, toJSON } } = require('node-captions');

const sccRead = util.promisify(read);
const sccToJSON = util.promisify(toJSON);

async function scc(subtitleFile) {
  const sccData = await sccRead(subtitleFile, {});
  return sccToJSON(sccData);
}

module.exports = scc;
