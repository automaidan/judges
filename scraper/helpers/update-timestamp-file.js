
const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const writeFile = Promise.promisify(require('fs').writeFile);

/**
 *
 * @param filePath
 * @param content
 * @returns {Promise<Array>}
 */
module.exports = function updateTimestampFile(filePath, content) {
  return Promise.resolve(filePath)
    .then(filePath => readFile(filePath, 'utf8'))
    .then((oldContent) => {
      if (content !== oldContent) {
        return writeFile(`${filePath}.timestamp`, `${new Date().getTime()}`);
      }
    });
};
