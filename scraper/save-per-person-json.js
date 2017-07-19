'use strict';
const Promise = require('bluebird');
const _ = require('lodash');
const writeFile = Promise.promisify(require('fs').writeFile);

/**
 * Get full list of persons
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function writeJudgesJSON(persons) {
  console.log('Save each judge into json');
  return Promise.map(persons, function (person) {
    person.declarationsLinks = _.map(person.allDeclarations, (d) => {
      return {
        id: _.get(d, 'document.id'),
        year: _.get(d, 'year'),
        url: _.get(d, 'document.declaration.url'),
        provider: _.get(d, 'provider'),
      }
    });
    const simplifiedJudgeData = _.omit(person, [
      'allDeclarations',
      'declarations',
      'declarationsLength'
    ]);
    return writeFile(`../profiles/${person.key}.json`, JSON.stringify(simplifiedJudgeData))
      .then(() => person);
  }, {concurrency: 18});
};
