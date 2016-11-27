"use strict";
const _ = require("lodash");

module.exports = function printJudgesWithoutDeclarations(judges) {
    console.log('Print judges names without declarations');

    _.forEach(function (judge) {
        if (!judge.declarations || !_.size(judge.declarations)) {
            console.log("Judge without declarations: " + judge.name);
        }
    });

    return judges;
};
