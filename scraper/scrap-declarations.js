

const Promise = require('bluebird');
const _ = require('lodash');
const config = require('./config');
const perPersonAnalytics = require('./per-person-analytics');

const providers = {
  'declarations.com.ua.opendata': require('./providers/declarations.com.ua.opendata/crawler'),
};
function log(i, max) {
  if (i % 100 === 0) {
    console.log(`Scraped ${parseInt((i / max) * 100, 10)}% of all judges.`);
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
  return Promise.map(
    persons,
    (person) => {
      log(i++, persons.length);

      return Promise.all([providers['declarations.com.ua.opendata'](person)])
        .spread((declarationsData) => {
          person.allDeclarations = _.concat(declarationsData);
          person.declarations = _.map(person.allDeclarations, 'document');
          person.declarationsLength =
            person.declarations && person.declarations.length;
          person.declarationsLinks = _.map(person.allDeclarations, d => ({
            id: d.id || _.get(d, 'document.id'),
            year: d.year,
            url: d.url || _.get(d, 'document.declaration.url'),
            provider: d.provider,
          }));
          person.analytics = perPersonAnalytics(person);
        })
        .then(() => _.omit(person, ['allDeclarations']));
    },
    { concurrency: config.get('SCRAPPER_SPEED') },
  );
};
