const fetch = require('../../helpers/fetch-json');
const Promise = require('bluebird');
const _ = require('lodash');
const sortObjectKeys = require('../../helpers/sort-object-keys');
const levenshteinStringDistance = require('levenshtein-string-distance');
const homonymsBlacklistDeclarationsComUaKeys = require('./homonyms-blacklist');
const getYear = require('./analytics').getYear;

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
      .map((perYearDeclarations) => {
        getYear;
        person;
        if (perYearDeclarations.length === 1) {
          return perYearDeclarations;
        }
        const onlyJudgesDecls = _.filter(
          perYearDeclarations,
          declaration => _.includes(_.lowerCase(_.get(declaration, 'infocard.office')), differOffice(person)),
        );
        if (onlyJudgesDecls.length === 1) {
          return perYearDeclarations;
        }
        const diff = _.difference(['NACP', 'VULYK'], onlyJudgesDecls.map(declaration => declaration.infocard.source)).length;
        if (onlyJudgesDecls.length === 2 && diff === 0) {
          return onlyJudgesDecls.filter(declaration => _.get(declaration, 'infocard.source') === 'NACP');
        } else if (onlyJudgesDecls.length === 2) {
          return _.head(
            _.sortBy(
              onlyJudgesDecls,
              declaration => -levenshteinStringDistance(_.get(declaration, 'infocard.position'), person.Position),
            ),
          );
        }
        if (onlyJudgesDecls.length === _.countBy(onlyJudgesDecls, declaration => declaration.infocard.source === 'NACP').true &&
          _.countBy(onlyJudgesDecls, declaration => declaration.infocard.document_type === 'Щорічна').true === 1 &&
          _.difference(['Форма змін', 'Щорічна'], onlyJudgesDecls.map(declaration => declaration.infocard.document_type)).length === 0
        ) {
          const yearly = _.cloneDeep(_.head(onlyJudgesDecls.filter(declaration => _.get(declaration, 'infocard.document_type') === 'Щорічна')));
          yearly.infocard.manuallyMerged = true;
          return _.merge(yearly, superArrayObjectsMerger(onlyJudgesDecls.filter(declaration => _.get(declaration, 'infocard.document_type') === 'Форма змін')));
        }

        // This year merge in
        if (onlyJudgesDecls.length === _.countBy(onlyJudgesDecls, declaration => declaration.infocard.source === 'NACP').true &&
          onlyJudgesDecls.length === _.countBy(onlyJudgesDecls, declaration => declaration.infocard.document_type === 'Форма змін').true
        ) {
          return _.merge({ manuallyMerged: true }, superArrayObjectsMerger(onlyJudgesDecls.filter(declaration => _.get(declaration, 'infocard.document_type') === 'Форма змін')));
        }
        console.log(onlyJudgesDecls);
        throw new Error('perYearDeclarations error');
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
