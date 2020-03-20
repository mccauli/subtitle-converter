const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getExtension } = require('../parsers/getExtension');
const { mixedSubtitles } = require('./mocks/mixedSubtitles');

describe('#validateExtension', () => {
  mixedSubtitles.forEach(subtitle => {
    const { subtitleText, type } = subtitle;
    it(`should be a(n) ${type} file`, () => {
      expect(getExtension(subtitleText)).to.equal(type);
    });
  });
});
