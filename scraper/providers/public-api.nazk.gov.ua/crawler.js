"use strict";
let fetch = require("../../helpers/fetch-json");
let Promise = require("bluebird");
let _ = require("lodash");
let levenshteinStringDistance = require("levenshtein-string-distance");
let writeFile = Promise.promisify(require("fs").writeFile);
const NAME = "public-api.nazk.gov.ua";
const input = require("./../../input/index");
const output = require("./../../output/index");
const inJudgeModel = require("./../../input/judge.json");
const outJudgeModel = require("./../../output/judge.json");
const homonymsBlacklist = require("./homonyms-blacklist");
function stringifyParse(object) {
    return JSON.parse(JSON.stringify(object));
}
function getSearchLink(s) {

    // Workaround for nazk apostrophe bug
    s = _.replace(s, "’", "`");

    s = _.replace(s, " ", "+");
    s = encodeURI(s);

    // Workaround for nazk apostrophe bug
    s = _.replace(s, "%27", "`");
    return `https://public-api.nazk.gov.ua/v1/declaration/?q=${s}`;
}
function getDeclarationLink(id) {
    return `https://public-api.nazk.gov.ua/v1/declaration/${id}`;
}

module.exports = function searchDeclaration(judge) {

    return fetch(getSearchLink(judge[inJudgeModel.name]))
    // return Promise.resolve(stringifyParse(require("./declarations-pointers-exapmle.json")))
        .then(response => {
            return _.chain(_.get(response, "items"))
                .filter(declarationPointer => {
                    const given = _.lowerCase(judge[inJudgeModel.name]);
                    const fetched = _.lowerCase(declarationPointer.lastname + " " + declarationPointer.firstname);
                    return levenshteinStringDistance(given, fetched) <= 3;
                })
                .filter(function (declarationPointer, index, declarations) {
                    return !_.includes(homonymsBlacklist[judge.key], declarationPointer.id);
                })
                .value();
        })
        .then(declarationPointers => {
            return Promise.map(declarationPointers, function (declarationPointer) {
                return fetch(getDeclarationLink(declarationPointer.id))
                // return Promise.resolve(stringifyParse(require("./declaration-exapmle.json")))
                    .then(serverResponse => {
                        serverResponse.data.id = serverResponse.id;
                        return writeFile(`../edeclarations/${serverResponse.id}.json`, JSON.stringify(serverResponse.data))
                            .then(() => {
                                return serverResponse.data;
                            });
                    })
            });
        })
        .then(declarations => {
            // declarations = filter declarationType ===1
            return _.sortBy(declarations, declaration => -parseInt(_.get(declaration, "step_0.declarationYear1"), 10));
        })
        .then(declarations => {
            return _.map(declarations, declaration => {
                return {
                    provider: NAME,
                    document: declaration
                };
            });
        })
        .catch(function (e) {
            throw new Error(e.message);
        })
};

//
// searchDeclaration({
//     Name: "Аліна Сніжана Степанівна",
//     key: "_abba",
// });
