const { describe, it } = require('mocha');
const { expect } = require('chai');
const { fromSrt } = require('subtitles-parser');
const convert = require('../converters');
const badTextMultipleReturns = require('./mocks/badTextMultipleReturns');
const badIndexSequence = require('./mocks/badIndexSequence');
const badIndexNotNumerical = require('./mocks/badIndexNotNumerical');
const badTimecodeSyntax = require('./mocks/badTimecodeSyntax');
const badTimecodeOverlap = require('./mocks/badTimecodeOverlap');
const badTimecodeStartsAtZero = require('./mocks/badTimecodeStartsAtZero');
const badTimecodeReversed = require('./mocks/badTimecodeReversed');
const badTextFormatted = require('./mocks/badTextFormatted');
const badTextBlank = require('./mocks/badTextBlank');
const goodSrt = require('./mocks/goodSRT');
const goodSCC = require('./mocks/goodSCC');
const goodTTML = require('./mocks/goodTTML');
const goodVTT = require('./mocks/goodVTT');
const goodVTT2 = require('./mocks/goodVTT2');
const goodDFXP = require('./mocks/goodDFXP');

describe('#convert', () => {
  it('should remove multiple returns on a line', () => {
    expect(badTextMultipleReturns.match(/\n\n+/g)).to.not.be.empty;
    const { subtitle, status } = convert(badTextMultipleReturns, '.srt', '.srt');
    expect(subtitle.match(/\n\n+/g)).to.be.null;
    expect(status.success).to.be.true;
  });

  // INDEX
  it('should resequence indices', () => {
    const { subtitle } = convert(badIndexSequence, '.srt', '.srt');
    const parsed = fromSrt(subtitle, true);
    expect(parsed[0].text).to.equal('Beijing, hazy sky');
    expect(parsed[1].text).to.equal('Can’t see original dreams');
  });

  it('should catch non numerical indices', () => {
    const { status } = convert(badIndexNotNumerical, '.srt', '.srt');
    expect(status.invalidEntries).to.not.be.empty;
  });

  // TIMECODE
  it('should shift timecode by seconds', () => {
    const initial = fromSrt(goodSrt, true);
    expect(initial[0].startTime).to.equal(5446);
    expect(initial[0].endTime).to.equal(10817);

    expect(initial[50].startTime).to.equal(348395);
    expect(initial[50].endTime).to.equal(351059);

    expect(initial[100].startTime).to.equal(553090);
    expect(initial[100].endTime).to.equal(556710);

    const { subtitle } = convert(goodSrt, '.srt', '.srt', { shiftTimecode: 3 });
    const parsed = fromSrt(subtitle, true);

    expect(parsed[0].startTime).to.equal(8446);
    expect(parsed[0].endTime).to.equal(13817);

    expect(parsed[50].startTime).to.equal(351395);
    expect(parsed[50].endTime).to.equal(354059);

    expect(parsed[100].startTime).to.equal(556090);
    expect(parsed[100].endTime).to.equal(559710);
  });
  it('should shift timecode by fps', () => {
    const initial = fromSrt(goodSrt, true);
    expect(initial[0].startTime).to.equal(5446);
    expect(initial[0].endTime).to.equal(10817);

    expect(initial[50].startTime).to.equal(348395);
    expect(initial[50].endTime).to.equal(351059);

    expect(initial[100].startTime).to.equal(553090);
    expect(initial[100].endTime).to.equal(556710);

    const { subtitle } = convert(goodSrt, '.srt', '.srt', { sourceFps: 30, outputFps: 24 });
    const parsed = fromSrt(subtitle, true);

    expect(parsed[0].startTime).to.equal(6807);
    expect(parsed[0].endTime).to.equal(13521);

    expect(parsed[50].startTime).to.equal(435493);
    expect(parsed[50].endTime).to.equal(438823);

    expect(parsed[100].startTime).to.equal(691362);
    expect(parsed[100].endTime).to.equal(695887);
  });
  it('should fix timecode overlap', () => {
    const { status } = convert(badTimecodeOverlap, '.srt', '.srt', { timecodeOverlapLimiter: 1 });
    expect(status.overlappingTimecodes).to.be.empty;
  });
  it('should start timecode at zero hour', () => {
    const { status } = convert(badTimecodeStartsAtZero, '.srt', '.srt', { startAtZeroHour: true });
    expect(status.startsAtZeroHour).to.be.true;
  });
  it('should find bad timecode syntax', () => {
    const { status } = convert(badTimecodeSyntax, '.srt', '.srt');
    expect(status.invalidTimecodes).to.not.be.empty;
  });
  it('should find bad timecode reversed', () => {
    const { status } = convert(badTimecodeReversed, '.srt', '.srt');
    expect(status.reversedTimecodes).to.not.be.empty;
  });

  // TEXT
  it('should remove text formatting', () => {
    const { status } = convert(badTextFormatted, '.srt', '.srt', { removeTextFormatting: true });
    expect(status.formattedText).to.be.empty;
  });
  it('should remove blank text', () => {
    const { subtitle } = convert(badTextBlank, '.srt', '.srt');
    const parsed = fromSrt(subtitle, true);
    expect(parsed).to.have.lengthOf(5);
  });

  // FORMATS
  it('should convert SCC to SRT', () => {
    const { status } = convert(goodSCC, '.scc', '.srt');
    expect(status.success).to.be.true;
  });
  it('should convert TTML to SRT', () => {
    const { status } = convert(goodTTML, '.ttml', '.srt');
    expect(status.success).to.be.true;
  });
  it('should convert VTT to SRT', () => {
    const { status } = convert(goodVTT, '.vtt', '.srt');
    expect(status.success).to.be.true;
  });
  it('should convert DFXP to SRT', () => {
    const { status } = convert(goodDFXP, '.dfxp', '.srt');
    expect(status.success).to.be.true;
  });

  it('should convert SCC to VTT', () => {
    const { status } = convert(goodSCC, '.scc', '.vtt');
    expect(status.success).to.be.true;
  });
  it('should convert TTML to VTT', () => {
    const { status } = convert(goodTTML, '.ttml', '.vtt');
    expect(status.success).to.be.true;
  });
  it('should convert VTT to VTT', () => {
    const { status } = convert(goodVTT2, '.vtt', '.vtt');
    expect(status.success).to.be.true;
  });
  it('should convert DFXP to VTT', () => {
    const { status } = convert(goodDFXP, '.dfxp', '.vtt');
    expect(status.success).to.be.true;
  });
});
