"use strict";
let fetch = require('node-fetch');
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");
const output = require("./output");
const judgeModel = require("./model/judge");

/**
 * Get full list of judges
 * @param {Array} judges
 * @returns {JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function scrapDeclarations(judges) {
    console.log('searchTheirDeclarations');
    return Promise.reduce(judges, function (_judges, judge) {
        return searchDeclaration(judge)
            .then(function (json) {
                judge.declarations = json;
                judge.declarationsLength = json && json.length;
                return writeFile(`../judges/${judge.key}.json`, JSON.stringify(judge))
                    .then(function () {
                        _judges.push({
                            d: judge[judgeModel.department], // department
                            p: judge[judgeModel.position], // position
                            r: judge[judgeModel.region], // region
                            n: judge[judgeModel.name], // Surname Name Patronymic
                            k: judge[judgeModel.key] // key of JSON file under http://prosud.info/judges/AbdukadirovaKarineEskenderivna.json
                        });
                        return _judges;
                    });
            })
    }, []);
};

function searchDeclaration(judge) {
    if (!judge[judgeModel.name]) {
        Promise.resolve(false);
        return;
    }
    // TODO add hack with readFile(`../declarations/${judge.key}.json`, 'utf8')
    return fetch(getSearchLink(judge[judgeModel.name]))
        .then(response => response.text())
        .then(data => JSON.parse(data))
        .then(response => {
            var uniq, duplicatedYears, groupedDuplicates;

            return _.chain(_.get(response, "results.object_list"))
                .filter(declaration => _.lowerCase(_.get(declaration, "general.full_name")) === _.lowerCase(judge[judgeModel.name]))
                .tap(declarations => {
                    uniq = _.countBy(response, d => _.get(d, "intro.declaration_year"));
                    duplicatedYears = Object.keys(uniq).filter((a) => uniq[a] > 1);
                    if (_.size(duplicatedYears)) {
                        groupedDuplicates = _.groupBy(response, d => _.get(d, "intro.declaration_year"));
                    }
                    return declarations;
                })
                .filter(function (declaration, index, declarations) {
                    if (_.size(duplicatedYears) && _.includes(duplicatedYears, _.get(declaration, "intro.declaration_year"))) {
                        debugger;
                    }
                    return true;
                })
                .sortBy(declaration => -parseInt(_.get(declaration, "intro.declaration_year"), 10))
                .value();
        })
        .then(declarations => {
            return writeFile(`../declarations/${judge.key}.json`, JSON.stringify(declarations))
                .then(() => declarations);
        })
        .catch(function (e) {
            throw new Error(e.message);
        })
}

function getSearchLink(s) {
    console.log("search " + s);
    s = encodeURI(s);
    return `http://declarations.com.ua/search?q=${s}&format=json`;
}
