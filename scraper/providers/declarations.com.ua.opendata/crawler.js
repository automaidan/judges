const fetch = require('../../helpers/fetch-json');
const Promise = require('bluebird');
const _ = require('lodash');
const sortObjectKeys = require('../../helpers/sort-object-keys');
const levenshteinStringDistance = require('levenshtein-string-distance');
const homonymsBlacklistDeclarationsComUaKeys = require('./homonyms-blacklist');
const getYear = require('./analytics').getYear;
const writeFile = Promise.promisify(require('fs').writeFile);

const NAME = 'declarations.com.ua.opendata';

function getSearchLink(name, page = 1) {
  // eslint-disable-next-line
  return `https://declarations.com.ua/search?q=${encodeURI(name)}&format=opendata&section=unified_source&section=infocard&page=${page}`;
}

function superArrayObjectsMerger(roles) {
  // Custom merge function ORs together non-object values, recursively
  // calls itself on Objects.
  const merger = (a, b) => {
    if (_.isObject(a)) {
      return _.merge({}, a, b, merger);
    }
    return a || b;
  };

  // Allow roles to be passed to _.merge as an array of arbitrary length
  const args = _.flatten([{}, roles, merger]);
  return _.merge(...args);
}

function setEmptyDeclarationYearLabel(declaration) {
  if (!_.get(declaration, 'unified_source.data.step_0.declarationYear1')) {
    return _.set(declaration, 'unified_source.data.step_0.declarationYear1', 'Не вказано');
  }
  return declaration;
}


// _.filter(persons, {t: 'prosecutor'})
const differOffice = (person) => {
  return person.type === 'judge' ? 'суд' : 'прокуро';
};


const getPage = (name, page = 1) => fetch(getSearchLink(name, page)).then(response => response.results);

const getAllRawDeclarations = name => getPage(name)
  .then((response) => {
    const pagesToFetch = _.slice([...Array(_.get(response, 'paginator.num_pages') + 1).keys()], 2);
    return Promise.reduce(pagesToFetch, (acc, currentPage) => getPage(name, currentPage)
      .then(currentResult => _.concat(acc, currentResult.object_list)), response.object_list);
  });

const getLowercasedFullName = rawDeclaration => _.lowerCase(
  `${_.get(rawDeclaration, 'infocard.last_name')} ${
    _.get(rawDeclaration, 'infocard.first_name')} ${
    _.get(rawDeclaration, 'infocard.patronymic')}`,
);

module.exports = function searchDeclaration(person) {
  const requestedName = _.lowerCase(person.Name);

  return getAllRawDeclarations(requestedName)
    .then(rawDeclarations => _.chain(rawDeclarations)
      .map(declaration => sortObjectKeys(_.omit(declaration, 'ft_src')))
      .filter(declaration => levenshteinStringDistance(requestedName, getLowercasedFullName(declaration)) <= 1)
      .filter(declaration => _.get(declaration, 'infocard.document_type') !== 'Перед звільненням')
      .filter(declaration => _.get(declaration, 'infocard.document_type') !== 'Після звільнення')
      .sortBy(declaration => -parseInt(getYear(declaration), 10))
      .value(),
    )
    .then(declarations => _.chain(declarations)
      .groupBy(getYear)
      .map((perYearDeclarations, year) => {
        getYear;
        person;
        if (perYearDeclarations.length === 1) {
          return perYearDeclarations;
        }

        // Possible reassignment
        let perOfficeDeclarations = _.filter(
          perYearDeclarations,
          declaration => _.includes(_.lowerCase(_.get(declaration, 'infocard.office')), differOffice(person)),
        );
        if (perOfficeDeclarations.length === 1) {
          return perYearDeclarations;
        }
        const diff = _.difference(['NACP', 'VULYK'], perOfficeDeclarations.map(declaration => declaration.infocard.source)).length;

        // Same year same person different source
        if (perOfficeDeclarations.length === 2 && diff === 0) {
          return perOfficeDeclarations.filter(declaration => _.get(declaration, 'infocard.source') === 'NACP');
        } else if (perOfficeDeclarations.length === 2) {
          // Different persons, same year
          return _.head(
            _.sortBy(
              perOfficeDeclarations,
              declaration => -levenshteinStringDistance(_.get(declaration, 'infocard.position'), person.Position),
            ),
          );
        }

        const perYearCount = _.countBy(perOfficeDeclarations, declaration => declaration.infocard.document_type === 'Щорічна').true;
        if (perYearCount === 2 &&
          _.countBy(perOfficeDeclarations, (declaration) => {
            return declaration.infocard.is_corrected === true && declaration.infocard.document_type === 'Щорічна';
          }).true === 1 &&
          _.countBy(perOfficeDeclarations, (declaration) => {
            return declaration.infocard.is_corrected === false && declaration.infocard.document_type === 'Щорічна';
          }).true === 1
        ) {
          perOfficeDeclarations = perOfficeDeclarations.filter((declaration) => {
            return !(declaration.infocard.is_corrected === false && declaration.infocard.document_type === 'Щорічна');
          });
        }

        // Merge in Форма змін into Щорічна
        if (perOfficeDeclarations.length === _.countBy(perOfficeDeclarations, declaration => declaration.infocard.source === 'NACP').true &&
          _.countBy(perOfficeDeclarations, declaration => declaration.infocard.document_type === 'Щорічна').true === 1 &&
          _.difference(['Форма змін', 'Щорічна'], perOfficeDeclarations.map(declaration => declaration.infocard.document_type)).length === 0
        ) {
          const yearly = _.cloneDeep(_.head(perOfficeDeclarations.filter(declaration => _.get(declaration, 'infocard.document_type') === 'Щорічна')));
          yearly.infocard.manuallyMerged = true;
          return _.merge(yearly, superArrayObjectsMerger(perOfficeDeclarations.filter(declaration => _.get(declaration, 'infocard.document_type') === 'Форма змін')));
        }

        // Merge in Форма змін into {} – it's current year
        if (perOfficeDeclarations.length === _.countBy(perOfficeDeclarations, declaration => declaration.infocard.source === 'NACP').true &&
          perOfficeDeclarations.length === _.countBy(perOfficeDeclarations, declaration => declaration.infocard.document_type === 'Форма змін').true
        ) {
          return _.merge({ manuallyMerged: true }, superArrayObjectsMerger(perOfficeDeclarations.filter(declaration => _.get(declaration, 'infocard.document_type') === 'Форма змін')));
        }
        writeFile(`${__dirname}/errors/${person.key}-${year}-${new Date()}.json`, JSON.stringify({ person, perYearDeclarations, perOfficeDeclarations }));
        // console.log(`Error on ${person.key} has ${perOfficeDeclarations.length} perOfficeDeclarations.`);
        return [];
      })
      .flatten()
      .value(),
    )
    .then(declarations => _.map(declarations, declaration => ({
      provider: NAME,
      year: getYear(declaration),
      document: declaration,
      id: _.get(declaration, 'infocard.id'),
      url: _.get(declaration, 'infocard.url'),
    })))
    .catch((e) => {
      throw new Error(e.message);
    });
};
