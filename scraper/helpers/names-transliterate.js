const _ = require('lodash');
const slugify = require('transliteration').slugify;
const personModel = require('./../input/person');

const homonyms = [
  'мельник володимир васильович',
  'мельник василь іванович',
  'мельник олександр михайлович',
  'микуляк павло павлович',
  'бойко ірина фнатоліївна',
  'григор\'єва ірина вікторівна',
  'левицька тетяна володимирівна',
  'лук’янова олена вікторівна',
  'новіков олег миколайович',
  'пономарьова ольга михайлівна',
  'ткаченко олександр васильович',
  'федченко володимир миколайович',
  'шевченко тетяна миколаївна',
];
function transliterateName(name) {
  return slugify(name, { lowercase: true, separator: '_', replace: [['doubleOnedouble', ''], ["'", ''], [';', ''], ['/', ''], ['’', '']] });
}

  /**
   *
   * @param {Array} persons
   * @returns {Array}
   */
module.exports = function transliterateNames(persons) {
  console.log('Play The Imitation Game');
  persons.forEach((person) => {
    if (!_.includes(homonyms, _.toLower(person[personModel.name]))) {
      person.key = _.toLower(transliterateName(person[personModel.name]));
    } else {
      person.key = _.toLower(transliterateName(`${person[personModel.name]} ${person[personModel.department]}`));
    }
  });
  return persons;
};
