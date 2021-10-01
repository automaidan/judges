

require('./helpers/detect-debug');
const getCurrentExchangeRates = require('./helpers/exchange-rates');
const Promise = require('bluebird');
const getPersons = require('./get-persons');
const fixNameLetterCase = require('./helpers/names-human-readable');
const scrapDeclarations = require('./scrap-declarations');
const savePerPersonJSON = require('./per-person-write-json');
const repackPersons = require('./re-pack-persons');
const assignKeyBasedOnName = require('./helpers/names-transliterate');
const createDictionary = require('./create-dictionary');
const zip = require('./zip');
const regionDepartmentMapping = require('./region-department-mapping');
const scrapTexts = require('./scrap-texts');

const log = {
  photos: require('./helpers/how-many-photos'),
  duplicates: require('./check-duplicates'),
  noDeclarations: require('./print-persons-without-declarations'),
};

Promise.all([
  Promise.resolve(getCurrentExchangeRates.getter())
    .then(getPersons)
    .then(fixNameLetterCase)
    .then(log.duplicates)
    .then(assignKeyBasedOnName)
    .then(log.photos)
    .then(scrapDeclarations)
    .then(savePerPersonJSON)
    .then(log.noDeclarations)
    .then(repackPersons)
    .then(createDictionary)
    .spread(zip)
    .spread(regionDepartmentMapping),
  scrapTexts(),
])
  .spread(() => {
    console.log('Done');
    process.exit(0);
  })
  .error(console.log)
  .catch(console.log);
