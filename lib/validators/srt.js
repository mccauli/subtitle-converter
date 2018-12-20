function cleanUpSrt(text) {
  return text.replace(/[\n]+/g, '\n');
}

module.exports = {
  cleanUpSrt,
};