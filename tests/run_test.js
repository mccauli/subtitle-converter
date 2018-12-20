// TODO remove this file
const parse = require('../lib/parsers/index');

const subtitleFiles = [
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_dfxp.dfxp',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_scc.scc',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_srt.srt',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_ttml.ttml',
  '/Users/ian/REPOSITORIES/janus/tests/test_subs/good_vtt.vtt',
];

Promise.all(subtitleFiles.map(file => parse(file)))
  .then(res => console.log(res.map(r => {
    delete r.source;
    return JSON.stringify(r, null, 2);
  }).join('\n\n\n')))
  .catch(err => console.log(err));
