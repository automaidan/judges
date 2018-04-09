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

function setEmptyDeclarationYearLabel(declaration) {
  if (!_.get(declaration, 'unified_source.data.step_0.declarationYear1')) {
    return _.set(declaration, 'unified_source.data.step_0.declarationYear1', 'Не вказано');
  }
  return declaration;
}

const getPage = (judge, page = 1) => fetch(getSearchLink(judge.Name, page)).then((response) => response.results);


module.exports = function searchDeclaration(judge) {
  const requestedName = _.lowerCase(judge.Name);

  return getPage(judge)
    .then((response) => {
      const pagesToFetch = _.slice([...Array(_.get(response, 'paginator.num_pages') + 1).keys()], 2);
      return Promise.reduce(pagesToFetch, (acc, currentPage) => {
        return getPage(judge, currentPage)
          .then((currentResult) => {
            return _.concat(acc, currentResult.object_list);
          });
      }, response.object_list);
    })
    .then((rawDeclarations) => {
      let unique;
      let duplicatedYears;
      let groupedDuplicates;

      return _.chain(rawDeclarations)
        .map(declaration => sortObjectKeys(_.omit(declaration, 'ft_src')))
        // .map(setEmptyDeclarationYearLabel)
        .filter((declaration) => {
          const fetchedName = _.lowerCase(
            _.get(declaration, 'infocard.last_name') +
            ' ' +
            _.get(declaration, 'infocard.first_name') +
            ' ' +
            _.get(declaration, 'infocard.patronymic'),
          );
          return levenshteinStringDistance(requestedName, fetchedName) <= 1;
        })
        .tap((declarations) => {
          unique = _.countBy(declarations, getYear);
          duplicatedYears = Object.keys(unique).filter((a) => unique[a] > 1);
          if (_.size(duplicatedYears)) {
            groupedDuplicates = _.groupBy(declarations, getYear);
          }
          return declarations;
        })
        // .filter((declaration, index, declarations) => {
        //   if (_.size(duplicatedYears) && _.includes(duplicatedYears, _.get(declaration, 'intro.declaration_year'))) {
        //     debugger;
        //   }
        //   if (_.includes(homonymsBlacklistDeclarationsComUaKeys[judge.key], declaration.id)) {
        //     return false;
        //   }
        //   return true;
        // })
        .sortBy(declaration => -parseInt(getYear(declaration), 10))
        .value();
    })
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
