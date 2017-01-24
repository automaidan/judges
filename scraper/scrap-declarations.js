"use strict";
let Promise = require('bluebird');
const _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);
const providers = {
    nazk: require('./providers/public-api.nazk.gov.ua/crawler'),
    declarations: require('./providers/declarations.com.ua/crawler')
};
function log(i, max) {
    if (i % 100 === 0) {
        console.log(`Scraped ${parseInt(i/max*100, 10)}% of all judges.`)
    }
}

/**
 * Get full list of judges
 * @param {Array} judges
 * @returns {Bluebird<U>|JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function scrapDeclarations(judges) {
    let i = 0;
    console.log('Release The Crawlers');
    return Promise.map(judges, function (judge) {

        log(i++, judges.length);

        return Promise.all([
            providers.declarations(judge),
            providers.nazk(judge)
        ])
            .spread(function (declarationsData, nazkData) {
                judge.allDeclarations = _.concat(nazkData, declarationsData);
                judge.declarations = _.map(judge.allDeclarations, "document");
                judge.declarationsLength = judge.declarations && judge.declarations.length;
            })
            .then(() => judge)
    }, {concurrency: 9});
};
