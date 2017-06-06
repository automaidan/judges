"use strict";
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");
const output = require("./output");

/**
 *
 * @param {Array} judges
 * @returns {Promise<Array>}
 */
module.exports = function regionDepartmentMapping (judges) {
    let mapping = _.reduce(judges, (result, judge) => {
        if (!result[judge.r]) {
            result[judge.r] = [judge.d];
        } else {
            result[judge.r].push(judge.d);
        }
        return result;
    }, {});

    mapping = _.mapValues(mapping, _.uniq);

    return Promise.resolve(JSON.stringify(mapping))
        .then((content) => writeFile(output.regionDepartmentMapping, content))
        .then(() => judges);
};
