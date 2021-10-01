
const fetch = require('../../helpers/fetch-json');
const Promise = require('bluebird');
const _ = require('lodash');
const levenshteinStringDistance = require('levenshtein-string-distance');
const writeFile = Promise.promisify(require('fs').writeFile);

const NAME = 'public-api.nazk.gov.ua';
const input = require('./../../input/index');
const output = require('./../../output/index');
const personModel = require('../../input/person.json');
const outJudgeModel = require('./../../output/judge.json');
const getYear = require('./analytics').getYear;
const homonymsBlacklist = require('./homonyms-blacklist');

function stringifyParse(object) {
  return JSON.parse(JSON.stringify(object));
}
function getSearchLink(s) {
  // Workaround for nazk apostrophe bug
  s = _.replace(s, '’', '`');
  s = _.replace(s, 'doubleOnedouble', '`');

  s = _.replace(s, ' ', '+');
  s = encodeURI(s);

  // Workaround for nazk apostrophe bug
  s = _.replace(s, '%27', '`');
  return `https://public-api.nazk.gov.ua/v1/declaration/?q=${s}`;
}
function getDeclarationLink(id) {
  return `https://public-api.nazk.gov.ua/v1/declaration/${id}`;
}

module.exports = function searchDeclaration(judge) {
  return fetch(getSearchLink(judge[personModel.name]))
  // return Promise.resolve(stringifyParse(require("./declarations-pointers-example.json")))
    .then(response => _.chain(_.get(response, 'items'))
        .filter((declarationPointer) => {
          const given = _.lowerCase(judge[personModel.name]);
          const fetched = _.lowerCase(`${declarationPointer.lastname} ${declarationPointer.firstname}`);
          return levenshteinStringDistance(given, fetched) <= 3;
        })
        .filter((declarationPointer, index, declarations) => !_.includes(homonymsBlacklist[judge.key], declarationPointer.id))
        .value())
    .then(declarationPointers => Promise.map(declarationPointers, declarationPointer => fetch(getDeclarationLink(declarationPointer.id))
        // return Promise.resolve(stringifyParse(require("./declaration-exapmle.json")))
          .then((serverResponse) => {
            serverResponse.data.id = serverResponse.id;
            return serverResponse.data;
            // return writeFile(`../public-api.nazk.gov.ua/${serverResponse.id}.json`, JSON.stringify(serverResponse.data))
            //     .then(() => {
            //         return serverResponse.data;
            //     });
          })))
    .then(declarations => _.chain(declarations)
        .filter(declaration => !(_.get(declaration, 'declarationType') === 1))
        .filter(declaration => !_.has(declaration, 'step_0.changesYear'))
        .sortBy(declaration => -getYear(declaration))
        .value())
    .then(declarations => _.map(declarations, declaration => ({
      provider: NAME,
      year: getYear(declaration),
      document: declaration,
    })))
    .catch((e) => {
      throw new Error(e.message);
    });
};

//
// searchDeclaration({
//     Name: "Аліна Сніжана Степанівна",
//     key: "_abba",
// });
