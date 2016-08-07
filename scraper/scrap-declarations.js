"use strict";
let fetch = require('node-fetch');
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);

const analytics = require('./analytics');

const input = require("./input");
const output = require("./output");
const inJudgeModel = require("./input/judge.json");
const outJudgeModel = require("./output/judge.json");

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
                        var _judge = {};

                        _judge[outJudgeModel.department] = judge[inJudgeModel.department];
                        _judge[outJudgeModel.position] = judge[inJudgeModel.position];
                        _judge[outJudgeModel.region] = judge[inJudgeModel.region];
                        _judge[outJudgeModel.name] = judge[inJudgeModel.name];
                        _judge[outJudgeModel.key] = judge[inJudgeModel.key];

                        var insight = analytics(judge);
                        if (insight) {
                            _judge[outJudgeModel.analytics] = insight;
                        }

                        var stigma = judge[inJudgeModel.stigma];
                        if (stigma) {
                            _judge[outJudgeModel.stigma] = stigma;
                        }

                        _judges.push(_judge);

                        return _judges;
                    });
            })
    }, []);
};

function searchDeclaration(judge) {
    if (!judge[inJudgeModel.name]) {
        Promise.resolve(false);
        return;
    }
    // TODO add hack with readFile(`../declarations/${judge.key}.json`, 'utf8')
    return fetch(getSearchLink(judge[inJudgeModel.name]))
        .then(response => response.text())
        .then(data => JSON.parse(data))
        .then(response => {
            var uniq, duplicatedYears, groupedDuplicates;

            return _.chain(_.get(response, "results.object_list"))
                .filter(declaration => _.lowerCase(_.get(declaration, "general.full_name")) === _.lowerCase(judge[inJudgeModel.name]))
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
