
const _ = require('lodash');

module.exports = function howManyPhoto(persons) {
  const stat = _.countBy(persons, person => !!person['Фото']);

  console.log(`${stat.true} judges has photo and ${stat.false} judges doesn't.`);

  return persons;
};
