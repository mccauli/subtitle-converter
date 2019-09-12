# subtitle-converter

Convert and modify subtitle files with NodeJS.

There are many subtitle tools written in node, but there are none that support all popular subtitle and caption formats. `subtitle-converter` builds off of the work of others (most notably `node-captions`, `node-webvtt`, and `subtitles-parser`) in order to ultimately become the only subtitle module necessary to include in your node project.

Currently supported input file types: `dfxp, scc, srt, ttml, vtt`

Currently supported output file types: `srt, vtt`

All output files are encoded with `UTF-8`. In the future we may support more encoding types.

## Install

`npm install subtitle-converter`

## Usage

```javascript
const convert = require('subtitle-converter');

const inputFilePath = '/tmp/some-movie.scc';
const outputFilePath = '/tmp/some-movie.srt'; // conversion is based on output file extension
const options = {
  removeTextFormatting: true,
};

convert(inputFilePath, outputFilePath, options)
  .then(outputFilepath => console.log(outputFilepath))
  .catch(err => console.log(err));
```

## Options

**shiftTimecode** (number) - Pass in the amount of seconds to shift the timecode. If undefined the output timecode will match the input.
- For example: `5`, `-5`, `5.2`

**sourceFps** (number) - Pass in the FPS of the video file used to create the input subtitle file. If `outputFps` is also included, `subtitle-converter` will shift the timecode accordingly to fit the output FPS.
- For example: `25`, `23.976`, `29.97`

**outputFps** (number) - Pass in the FPS desired for the output subtitle file. `sourceFps` is a required field in order to do FPS conversion.
- For example: `25`, `23.976`, `29.97`

**removeTextFormatting** (boolean) - Default is `false`. If set to `true`, tags such as `<b>` and `{bold}` will be stripped from the text. This may be useful when converting to formats that do not support styling in this manner.

**timecodeOverlapLimiter** (number, boolean) - Default is `false`, allowing overlapping timecode. If a number (in seconds) is included `subtitle-converter` will automatically fix overlapping timecode if the amount of seconds the text overlaps is less than the `timecodeOverlapLimiter`.
- If this value is set to `1` and your SRT looks like:
```
1
00:00:15,448 --> 00:00:18,000
Hello

2
00:00:17,417 --> 00:00:19,252
World
```
- Then the output would become:
```
1
00:00:15,448 --> 00:00:17,417
Hello

2
00:00:17,417 --> 00:00:19,252
World
```

## Contributing

TODO
