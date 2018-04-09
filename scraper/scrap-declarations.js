'use strict';
let Promise = require('bluebird');
const _ = require('lodash');
const config = require('./config');
let writeFile = Promise.promisify(require('fs').writeFile);
const providers = {
  'declarations.com.ua.opendata': require('./providers/declarations.com.ua.opendata/crawler'),
};
function log(i, max) {
  if (i % 100 === 0) {
    console.log(`Scraped ${parseInt(i / max * 100, 10)}% of all judges.`)
  }
}

/**
 * Get full list of persons
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function scrapDeclarations(persons) {
  let i = 0;
  console.log('Release The Crawlers');
  return Promise.map(persons, function (person) {

    log(i++, persons.length);

    return Promise.all([
      providers['declarations.com.ua.opendata'](person),
    ])
      .spread(function (declarationsData) {
        person.allDeclarations = _.concat(declarationsData);
        person.declarations = _.map(person.allDeclarations, 'document');
        person.declarationsLength = person.declarations && person.declarations.length;
      })
      .then(() => person)
  }, {concurrency: config.get('SCRAPPER_SPEED')});
};
