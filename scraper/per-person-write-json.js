const Promise = require('bluebird');
const _ = require('lodash');
const stringify = require('json-stable-stringify');
const writeFile = Promise.promisify(require('fs').writeFile);

/**
 * Get full list of persons
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function writeJudgesJSON(persons) {
  console.log('Save each judge into json');
  return Promise.map(persons, (person) => {
    const simplifiedJudgeData = _.omit(person, [
      'allDeclarations',
      'declarations',
      'declarationsLength',
    ]);
    return writeFile(`../profiles/${person.key}.json`, stringify(simplifiedJudgeData))
      .then(() => person);
  }, { concurrency: 18 });
};
