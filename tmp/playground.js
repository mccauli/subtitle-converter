
const fs = require('fs');
const path = require('path');

// const srtEntries = require('../lib/parsers/srtEntries.js');
// const filepath = '/Users/omateo/Repositories/subtitle-converter/tmp/subtitles/s.srt';
// const subtitleText = fs.readFileSync(filepath, 'utf-8');
const convert = require('../lib/converters/index')
// const subtitleJS = require('../tmp/subtitles/s.srt');
const outputExtension = '.srt'; // conversion is based on output file extension

const options = {
  removeTextFormatting: true,
};

// const result = srtEntries(subtitleText);

// console.log(result)

const directoryPath = path.join(__dirname, 'subtitles/fromCorey');
// passing directoryPath and callback function
function playground() {
  fs.readdir(directoryPath, (err, files) => {
    // handling error
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }
    // listing all files using forEach
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      console.log('==================', file)
      if (file !== '.DS_Store' && file !== 'fromCorey') {
        const { status, subtitle } = convert(fs.readFileSync(filePath, 'utf-8'), '.srt', options)
        // if (!status.success) 
        // console.log(subtitle);
        console.log(status);
      }
      // if(path.parse(file).ext !== extract && file !== '.DS_Store'){
      //     console.log(file + '===BUT TOOL HAS FOUND: ' + extract)
      // }
      // if (file !== '.DS_Store') {
      //   convert(fs.readFileSync(filePath, 'utf-8'), '.srt', { removeTextFormatting: true });
      // }
      // fs.writeFileSync
    });
  });
}

playground();