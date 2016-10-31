"use strict";
let fetch = require('node-fetch');
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);

const analytics = require('./analytics');
const checkNazk = require('./helpers/check-nazk');

const input = require("./input");
const output = require("./output");
const inJudgeModel = require("./input/judge.json");
const outJudgeModel = require("./output/judge.json");
const homonymsBlacklistDeclarationsComUaKeys = {
    melnik_oleksandr_mihaylovich_novomoskovskiy_miskrayonniy_dnipropetrovskoyi_oblasti: ["vulyk_66_51", "vulyk_11_177"],
    melnik_oleksandr_mihaylovich_mikolayivskiy_okruzhniy_administrativniy_sud: ["vulyk_77_27", "vulyk_11_177"],
    tkachenko_oleg_mikolayovich: ["vulyk_30_158"],
    mikulyak_pavlo_pavlovich_zakarpatskiy_okruzhniy_administrativniy_sud: ["vulyk_68_5"],
    mikulyak_pavlo_pavlovich_uzhgorodskiy_miskrayonniy_sud_zakarpatskoyi_oblasti: ["vulyk_67_185"],
    shevchenko_oleksandr_volodimirovich: ["vulyk_35_200"],
    dyachuk_vasil_mikolayovich: ["vulyk_28_124"]
};

/**
 * Get full list of judges
 * @param {Array} judges
 * @returns {JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function scrapDeclarations(judges) {
    console.log('searchTheirDeclarations');
    return Promise.map(judges, function (judge) {
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

                        if (!checkNazk(_judge[outJudgeModel.name])) {
                            console.log(_judge[outJudgeModel.name]);
                            if (stigma) {
                                _judge[outJudgeModel.stigma] += "6";
                            }
                            _judge[outJudgeModel.stigma] = "6";
                        }

                        return _judge;
                    });
            })
    }, {concurrency: 18});
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
                    if (_.includes(homonymsBlacklistDeclarationsComUaKeys[judge.key], declaration.id)) {
                        return false;
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
    // console.log("search " + s);
    s = encodeURI(s);
    return `http://declarations.com.ua/search?q=${s}&format=json`;
}
