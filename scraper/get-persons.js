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
 * Get full list of persons to scrap
 * @returns {Promise<Array>}
 */
module.exports = function getPersons() {
    if (config.get("READ_CACHE")) {
        console.log("Use cached persons JSON.");
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
        .then(function (persons) {
            return Promise.resolve(JSON.stringify(persons))
                .then((content) => writeFile(input.cachedList, content))
                .then(() => persons)
                .then(() => _.take(persons, config.get("PERSONS_LIMIT")));
        })
        .then(function (persons) {
            console.log('Filter empty lines in scraped google sheets document.');
            return _.filter(persons, person => person[personModel.name] && !/\d/.test(person[personModel.name]))
        });
};
