"use strict";
const _ = require("lodash");

/**
 *
 * @param {Array} judges
 * @returns {Promise<Array>}
 */
module.exports = function printJudgesWithoutDeclarations(judges) {
    console.log('Print judges names without declarations');

    _.forEach(judges, function (judge) {
        if (judge && (!judge.declarations || !_.size(judge.declarations))) {
            console.log("Judge without declarations: " + judge.Name);
        }
    });

    return Promise.resolve(judges);
};
