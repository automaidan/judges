const Promise = require('bluebird');
const _ = require('lodash');
const writeFile = Promise.promisify(require('fs').writeFile);
const output = require('./output');

/**
 *
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
exports = function createDictionary(persons) {
  console.log('Create minimized dictionary'); // eslint-disable-line no-console
  const d = _.uniq(_.map(persons, 'd'));
  const p = _.uniq(_.map(persons, 'p'));
  const r = _.uniq(_.map(persons, 'r'));

  const dictionary = _.keyBy(d.concat(p).concat(r), () => _.uniqueId());

  const correctedDictionary = _.mapValues(dictionary, value => _.toString(value));

  return Promise.resolve(JSON.stringify(correctedDictionary))
    .then(content => writeFile(output.dictionary, content))
    .then(() => [persons, _.invert(dictionary)]);
};
