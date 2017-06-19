"use strict";
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");
const output = require("./output");
const regionCollector = (persons) => {
    _.mapValues(
        _.reduce(persons, (result, person) => {
        if (!result[person.r]) {
            result[person.r] = [person.d];
        } else {
            result[person.r].push(person.d);
        }
        return result;
    }, {}),
        _.uniq
    );
};

/**
 *
 * @param {Array} judges
 * @param {Array} prosecutors
 * @returns {Promise<Array>}
 */
module.exports = function regionDepartmentMapping (judges, prosecutors) {
    return Promise.resolve([
        JSON.stringify(regionCollector(judges)),
        JSON.stringify(regionCollector(prosecutors))
    ])
        .then((judges, prosecutors) => [
            judges,
            prosecutors,
            writeFile(output.regionDepartmentMapping, judges),
            writeFile(output.prosecutorsRegionDepartmentMapping, prosecutors)
        ]);
};
