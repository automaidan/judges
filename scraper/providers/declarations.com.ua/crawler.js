'use strict';
let fetch = require('../../helpers/fetch-json');
let Promise = require('bluebird');
let _ = require('lodash');
let writeFile = Promise.promisify(require('fs').writeFile);
let levenshteinStringDistance = require('levenshtein-string-distance');
const NAME = 'declarations.com.ua';
const input = require('./../../input/index');
const output = require('./../../output/index');
const personModel = require('../../input/person.json');
const outJudgeModel = require('./../../output/judge.json');
const getYear = require('./analytics').getYear;
const homonymsBlacklistDeclarationsComUaKeys = require('./homonyms-blacklist');
function getSearchLink(s) {
  if ('Абдукадирова Каріне Ескандерівна' === s) {
    s = 'Абдукадирова Каріне Ескендерівна';
  }
  s = encodeURI(s);
  return `http://declarations.com.ua/search?q=${s}&format=json`;
}

// This is workaround for making git happy.
// The problem is – git "highlight" changes, where they don't,
// just because declarations.com.ua time to time change object_list keys order without making any changes to data.
function makeObjectKeysBeSorted(o) {
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}
function setEmptyDeclarationYearLabel(declaration) {
  if (!_.get(declaration, 'intro.declaration_year')) {
    return _.set(declaration, 'intro.declaration_year', 'Не вказано');
  }
  return declaration;
}

module.exports = function searchDeclaration(judge) {

  return fetch(getSearchLink(judge[personModel.name]))
    .then(response => {
      let uniq, duplicatedYears, groupedDuplicates;

      return _.chain(_.get(response, 'results.object_list'))
        .map(declaration => {
          return makeObjectKeysBeSorted(_.omit(declaration, 'ft_src'));
        })
        .map(setEmptyDeclarationYearLabel)
        .filter(declaration => {
          const given = _.lowerCase(judge[personModel.name]);
          const fetched = _.lowerCase(_.get(declaration, 'general.full_name'));
          return levenshteinStringDistance(given, fetched) <= 1;
        })
        .tap(declarations => {
          uniq = _.countBy(response, d => _.get(d, 'intro.declaration_year'));
          duplicatedYears = Object.keys(uniq).filter((a) => uniq[a] > 1);
          if (_.size(duplicatedYears)) {
            groupedDuplicates = _.groupBy(response, d => _.get(d, 'intro.declaration_year'));
          }
          return declarations;
        })
        .filter(function (declaration, index, declarations) {
          if (_.size(duplicatedYears) && _.includes(duplicatedYears, _.get(declaration, 'intro.declaration_year'))) {
            debugger;
          }
          if (_.includes(homonymsBlacklistDeclarationsComUaKeys[judge.key], declaration.id)) {
            return false;
          }
          return true;
        })
        .sortBy(declaration => -parseInt(_.get(declaration, 'intro.declaration_year'), 10))
        .value();
    })
    // .then(declarations => {
    //     return Promise.map(declarations, declaration => {
    //         return writeFile(`../declarations.com.ua/${declaration.id}.json`, JSON.stringify(declaration));
    //     })
    //         .then(() => {
    //             return declarations;
    //         });
    // })
    .then(declarations => {
      return _.map(declarations, declaration => {
        return {
          provider: NAME,
          year: getYear(declaration),
          document: declaration
        };
      });
    })
    .catch(function (e) {
      throw new Error(e.message);
    })
};
