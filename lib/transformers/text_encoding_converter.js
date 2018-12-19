const fs = require('fs-extra');
const childProcess = require('child_process');
const iconv = require('iconv-lite');
const os = require('os');

function convertTextEncoding(filename) {
  return new Promise((resolve, reject) => {
    const PLATFORM = os.platform();
    let i = '-i ';
    let ROMAN = 'MACINTOSH';

    if (PLATFORM !== 'linux') {
      i = '-I ';
      ROMAN = 'MACROMAN';
    }

    childProcess.exec(`file ${i} "${filename}"`, (err, stdout) => {
      if (err) { reject(new Error(err)); return; }
      if (!stdout.split('charset=')[1]) {
        reject(new Error(`"${filename}" encoding was not detected`));
        return;
      }

      const textEncoding = stdout.split('charset=')[1].toString().trim();
      if (textEncoding === 'utf-8' || textEncoding === 'us-ascii') {
        resolve();
        return;
      }

      const originalCopy = filename.replace('.', '-original.');

      childProcess.exec(`cp "${filename}" "${originalCopy}"`);
      if (textEncoding === 'binary') {
        const tempFileName = originalCopy.replace('original.', 'temp.');

        childProcess.exec(`cat "${originalCopy}" | LC_ALL=C col -b > "${tempFileName}"`);
        childProcess.exec(`dos2unix -q "${tempFileName}"`);
        childProcess.exec(`mv "${tempFileName}" "${filename}"`);

        childProcess.exec(`file ${i} + "${filename}"`, (err3, stdout3) => {
          const newTextEncoding = stdout3.split('charset=')[1].toString().trim();

          fs.createReadStream(filename)
            .pipe(iconv.decodeStream(newTextEncoding))
            .pipe(iconv.encodeStream('utf8'))
            .pipe(fs.createWriteStream(tempFileName));

          childProcess.exec(`mv "${tempFileName}" "${filename}"`, err4 => {
            if (err4) { reject(new Error(err4)); return; }
            fs.remove(originalCopy);
            resolve();
          });
        });
      } else if (textEncoding.indexOf('unknown') > -1) {
        childProcess.exec(`iconv -f ${ROMAN} -t utf8 "${originalCopy}" > "${filename}"`, err3 => {
          if (err3) { reject(new Error(err3)); return; }
          fs.remove(originalCopy);
          resolve();
        });
      } else {
        console.log(`WARNING: "${filename}" was not UTF-8, US-ASCII, BINARY or UNKNOWN`);
        childProcess.exec(`iconv -f ${textEncoding} -t utf8 "${originalCopy}" > "${filename}"`, err3 => {
          if (err3) { reject(new Error(err3)); return; }
          fs.remove(originalCopy);
          reject(new Error('Obscure text encoding detected'));
        });
      }
    });
  });
}


module.exports = convertTextEncoding;
