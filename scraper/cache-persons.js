"use strict";
let _ = require('lodash');
const config = require("./config");
let Promise = require('bluebird');
let writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");

module.exports = function saveLocalJudgesJSON(judges) {
    if (config.get("LOCAL_JUDGES_JSON")) {
        return judges;
    }

    console.log("Save fetched judges list locally.");
    return writeFile(input.cachedList, JSON.stringify(judges))
        .then(() => judges);
};
