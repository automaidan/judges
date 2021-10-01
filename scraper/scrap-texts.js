
const _ = require('lodash');
const Promise = require('bluebird');
const writeFile = Promise.promisify(require('fs').writeFile);
const remoteCSVtoJSON = require('./helpers/remote-csv-to-json');

const input = require('./input');
const output = require('./output');

module.exports = function scrapTexts() {
  console.log('Scrap site texts.');
  return remoteCSVtoJSON(input.textsCSV)
    .then((texts) => {
      console.log('scrapTexts:texts');
      const textsKeyValue = {};
      _.forEach(texts, (text) => {
        textsKeyValue[text.key] = text.ukr;
      });
      return Promise.resolve(JSON.stringify(textsKeyValue))
        .then(content => writeFile(output.texts, content))
        .then(() => texts);
    });
};
