"use strict";
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");
const output = require("./output");
const regionCollector = (persons) => {
    return _.mapValues(_.reduce(persons, (result, person) => {
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
module.exports = (judges, prosecutors) => {
    return Promise.all([
        regionCollector(judges),
        regionCollector(prosecutors)
    ])
        .spread((judges, prosecutors) => [
            judges,
            prosecutors,
            writeFile(output.regionDepartmentMapping, JSON.stringify(judges)),
            writeFile(output.prosecutorsRegionDepartmentMapping, JSON.stringify(prosecutors))
        ]);
};
