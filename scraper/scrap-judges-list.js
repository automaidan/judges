"use strict";
let _ = require("lodash");
let Promise = require('bluebird');
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);
let remoteCSVtoJSON = require("./helpers/remote-csv-to-json");
const config = require("./config");

const input = require("./input");
const output = require("./output");
const personModel = require("./input/person.json");

/**
 * Get full list of judges
 * @returns {Promise<Array>}
 */
module.exports = function scrapJudgesList() {
    if (config.get("LOCAL_JUDGES_JSON")) {
        console.log("Use cached judges JSON.");
        return Promise.resolve(input.cachedList)
            .then((cachedList) => readFile(input.cachedList, 'utf8'))
            .then(data => JSON.parse(data))
            .then(data => _.take(data, config.get("PERSONS_LIMIT")));
    }

    return Promise.all([
        readFile(input.judgesPerRegionCSVLinksArray, 'utf8').then(JSON.parse),
        readFile(input.prosecutorsPerRegionCSVLinksArray, 'utf8').then(JSON.parse)
    ])
        .spread(function (judgesLinks, prosecutorsLinks) {
            const data = judgesLinks.concat(prosecutorsLinks);

            return Promise.map(data, function (region) {
                console.log("Fetching: " + region.name);
                return remoteCSVtoJSON(region.link)
                    .then((json) => {
                        json.type = region.type;
                        return json;
                    })
            }, {concurrency: config.get("SCRAPPER_SPEED")})
                .then(regions => _.flatten(regions));
        })
        .then(function (judges) {
            return Promise.resolve(JSON.stringify(judges))
                .then((content) => writeFile(input.cachedList, content))
                .then(() => judges)
                .then(() => _.take(judges, config.get("PERSONS_LIMIT")));
        })
        .then(function (judges) {
            console.log('Filter empty lines in scraped google sheets document.');
            return _.filter(judges, judge => judge[personModel.name] && !/\d/.test(judge[personModel.name]))
        });
};
