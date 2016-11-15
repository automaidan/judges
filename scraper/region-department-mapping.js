"use strict";
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require("lodash");
const writeFile = Promise.promisify(require('fs').writeFile);

const updateTimestampFile = require("./helpers/update-timestamp-file");

const input = require("./input");
const output = require("./output");

/**
 *
 * @param {Array} judges
 * @returns {PromiseLike<*[]>|Promise<*[]>|JQueryPromise<*[]>|JQueryPromise<void>|Promise.<*[]>}
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

    var content = JSON.stringify(mapping);
    return updateTimestampFile(output.regionDepartmentMapping, content)
        .then(() => writeFile(output.regionDepartmentMapping, content))
        .then(() => judges);
};
