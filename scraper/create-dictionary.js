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
module.exports = function createDictionary (judges) {
    console.log("Create minimized dictionary");
    var d = _.uniq(_.map(judges, 'd'));
    var p = _.uniq(_.map(judges, 'p'));
    var r = _.uniq(_.map(judges, 'r'));

    var dictionary = _.keyBy(d.concat(p).concat(r), function() {
        return _.uniqueId();
    });

    var correctedDictionary = _.mapValues(dictionary, function (value) {
        return _.toString(value);
    });

    var content = JSON.stringify(correctedDictionary);
    return updateTimestampFile(output.dictionary, content)
        .then(() => writeFile(output.dictionary, content))
        .then(() => [judges, _.invert(dictionary)]);
};
