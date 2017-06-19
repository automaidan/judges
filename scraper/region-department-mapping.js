"use strict";
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");
const output = require("./output");

/**
 *
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function regionDepartmentMapping (persons) {
    let mapping = _.reduce(persons, (result, person) => {
        if (!result[person.r]) {
            result[person.r] = [person.d];
        } else {
            result[person.r].push(person.d);
        }
        return result;
    }, {});

    mapping = _.mapValues(mapping, _.uniq);

    return Promise.resolve(JSON.stringify(mapping))
        .then((content) => writeFile(output.regionDepartmentMapping, content))
        .then(() => persons);
};
