const { describe, it } = require('mocha');
const { expect } = require('chai');
const validate = require('../validators');
const goodSRT = require('./mocks/goodSRT');
const badTimecodeReversed = require('./mocks/badTimecodeReversed');
const badTimecodeOverlap = require('./mocks/badTimecodeOverlap');
const badTextFormatted = require('./mocks/badTextFormatted');

describe('#validate', () => {
  it('should be successful on a good srt', () => {
    const status = validate(goodSRT, '.srt');
    expect(status.success).to.be.true;
  });
  it('should show reversed timecodes', () => {
    const status = validate(badTimecodeReversed, '.srt', { reversedTimecodes: true });
    expect(status.success).to.be.false;
    expect(status.reversedTimecodes).to.not.be.empty;
  });
  it('should show overlapping timecodes', () => {
    const status = validate(badTimecodeOverlap, '.srt', { overlappingTimecodes: true });
    expect(status.success).to.be.false;
    expect(status.overlappingTimecodes).to.not.be.empty;
  });
  it('should show formatted text', () => {
    const status = validate(badTextFormatted, '.srt', { formattedText: true });
    expect(status.success).to.be.false;
    expect(status.formattedText).to.not.be.empty;
  });
});
