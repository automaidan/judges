
const _ = require('lodash');

const input = require('./input');
const output = require('./output');
const personModel = require('./input/person.json');

/**
 *
 * @param {Array} persons
 * @returns {Array}
 */
module.exports = function checkDuplicates(persons) {
  console.log(`Stop the Attack of the Clones. There are ${persons.length} persons.`);
  const uniq = persons
    .map(person => ({ count: 1, name: person[personModel.name] }))
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});

  const duplicates = Object.keys(uniq).filter(a => uniq[a] > 1);

  if (_.size(duplicates)) {
    console.log('... clones win.');
    _.forEach(duplicates, (duplicate) => {
      if (uniq[duplicate] > 2) {
        console.log(`More then 2 ${uniq[duplicate]} ${duplicate}`);
      }
    });
  }
  return persons;
};
