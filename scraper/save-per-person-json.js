"use strict";
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

/**
 * Get full list of judges
 * @param {Array} judges
 * @returns {Promise<Array>}
 */
module.exports = function writeJudgesJSON(judges) {
    console.log('Save each judge into json');
    return Promise.map(judges, function (judge) {
        judge.declarationsLinks = _.map(judge.allDeclarations, (d) => {
            return {
                id: _.get(d, "document.id"),
                year: _.get(d, "year"),
                url: _.get(d, "document.declaration.url"),
                provider: _.get(d, "provider"),
            }
        });
        const simplifiedJudgeData = _.omit(judge, [
            "allDeclarations",
            "declarations",
            "declarationsLength"
        ]);
        return writeFile(`../judges/${judge.key}.json`, JSON.stringify(simplifiedJudgeData))
            .then(() => judge);
    }, {concurrency: 18});
};
