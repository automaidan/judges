"use strict";
let _ = require("lodash");
let Promise = require('bluebird');
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);
let remoteCSVtoJSON = require("./helpers/remote-csv-to-json");

const input = require("./input");
const output = require("./output");
const judgeModel = require("./input/judge.json");

/**
 * Get full list of judges
 * @returns {Promise<Array>}
 */
module.exports = function scrapJudgesList() {
    if (process.env.LOCAL_JUDGES_JSON) {
        console.log("Use cached judges JSON.");
        return readFile(input.cachedJudges, 'utf8')
            .then(data => JSON.parse(data))

            // TODO add ENV variable to limit this
            // .then(data => _.take(data, 1))
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
            return Promise.resolve(JSON.stringify(judges))
                .then((content) => writeFile(input.cachedJudges, content))
                .then(() => judges);
                // TODO add ENV variable to limit this
                // .then(() => _.pick(judges, 1));
        })
        .then(function (judges) {
            console.log('Filter empty lines in scraped google sheets document.');
            return _.filter(judges, judge => judge[judgeModel.name] && !/\d/.test(judge[judgeModel.name]))
        });
};
