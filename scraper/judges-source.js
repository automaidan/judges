"use strict";
let _ = require("lodash");
let Promise = require('bluebird');
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);
let remoteCSVtoJSON = require("./remote-csv-to-json");

const updateTimestampFile = require("./update-timestamp-file");

const input = require("./input");
const output = require("./output");

/**
 * Get full list of judges
 * @returns {JQueryPromise<U>|PromiseLike<TResult>|IPromise<TResult>|JQueryPromise<any>|Promise.<TResult>|JQueryPromise<void>|any}
 */
module.exports = function getJudgesSource() {
    if (process.env.LOCAL_JUDGES_JSON) {
        console.log("Use cached judges JSON.");
        return readFile(input.cachedJudges, 'utf8')
            .then(data => JSON.parse(data))
    }

    return readFile(input.judgesPerRegionCSVLinksArray, 'utf8')
        .then(function (data) {
            return Promise.reduce(JSON.parse(data), function (regions, region) {
                console.log("Fetching: " + region.name);
                return remoteCSVtoJSON(region.link)
                    .then((json) => regions.concat(json));
            }, []);
        })
        .then(function (judges) {
            var content = JSON.stringify(judges);
            return updateTimestampFile(input.cachedJudges, content)
                .then(() => writeFile(input.cachedJudges, content))
                .then(() => judges);
        })
        .then(function (judges) {
            console.log('filterEmptyLines');
            return _.filter(judges, judge => judge[judgeModel.name] && !/\d/.test(judge[judgeModel.name]))
        });
};
