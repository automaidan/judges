
const Promise = require('bluebird');
const _ = require('lodash');
const writeFile = Promise.promisify(require('fs').writeFile);

const input = require('./input');
const output = require('./output');

/**
 *
 * @param {Array} persons
 * @param {Array} dictionary
 * @returns {Promise<Array>}
 */
module.exports = (persons, dictionary) => {
  console.log('Zip persons.');
  persons = _.map(persons, (person) => {
    person.d = _.get(dictionary, person.d);
    person.p = _.get(dictionary, person.p);
    person.r = _.get(dictionary, person.r);

    return person;
  });

  return Promise.resolve([
    _.filter(persons, { t: 'judge' }),
    _.filter(persons, { t: 'prosecutor' }),
  ])
    .spread((judges, prosecutors) => [
      judges,
      prosecutors,
      writeFile(output.judges, JSON.stringify(judges)),
      writeFile(output.prosecutors, JSON.stringify(prosecutors)),
    ]);
};
