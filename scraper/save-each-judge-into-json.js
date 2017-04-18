"use strict";
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

/**
 * Get full list of judges
 * @param {Array} judges
 * @returns {JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function writeJudgesJSON(judges) {
    console.log('Save each judge into json');
    return Promise.map(judges, function (judge) {
        const simplifiedJudgeData = _.omit(judge, [
            "allDeclarations",
            "declarations",
            "declarationsLength"
        ]);
        return writeFile(`../judges/${judge.key}.json`, JSON.stringify(simplifiedJudgeData))
            .then(() => judge);
    }, {concurrency: 18});
};
