"use strict";
let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);

const updateTimestampFile = require("./helpers/update-timestamp-file");

const input = require("./input");
const output = require("./output");

/**
 *
 * @param {Array} judges
 * @param {Array} dictionary
 * @returns {PromiseLike<*[]>|Promise<*[]>|JQueryPromise<*[]>|JQueryPromise<void>|Promise.<*[]>}
 */
module.exports = function zipJudges (judges, dictionary) {
    console.log("Zip judges.");
    judges = _.map(judges, (judge) => {
        return {
            d: _.get(dictionary, judge.d), // department
            p: _.get(dictionary, judge.p), // position
            r: _.get(dictionary, judge.r), // region
            n: judge.n, // Surname Name Patronymic
            k: judge.k, // key of JSON file under http://prosud.info/declarations/AbdukadirovaKarineEskenderivna.json
            s: judge.s, // Stigma
            a: judge.a // Analytics
        };
    });

    const content = JSON.stringify(judges);
    return updateTimestampFile(output.judges, content)
        .then(() => writeFile(output.judges, content))
        .then(() => judges);
};
