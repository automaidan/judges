"use strict";
let _ = require('lodash');
let Promise = require('bluebird');
let writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");

module.exports = function saveLocalJudgesJSON(judges) {
    if (process.env.LOCAL_JUDGES_JSON) {
        return judges;
    }

    console.log("Save fetched judges list locally.");
    return writeFile(input.cachedJudges, JSON.stringify(judges))
        .then(() => judges);
};
