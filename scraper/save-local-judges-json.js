"use strict";
let Promise = require('bluebird');
let writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");

module.exports = function saveLocalJudgesJSON(judges) {
    return writeFile(input.cachedJudges, JSON.stringify(judges))
        .then(() => judges);
};
