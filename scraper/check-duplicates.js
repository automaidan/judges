"use strict";
let _ = require("lodash");

const input = require("./input");
const output = require("./output");
const judgeModel = require("./input/judge.json");

/**
 *
 * @param {Array} judges
 * @returns {Array}
 */
module.exports = function checkDuplicates(judges) {
    console.log('Stop the Attack of the Clones');
    var uniq = judges
        .map((judge) => {
            return {count: 1, name: judge[judgeModel.name]}
        })
        .reduce((a, b) => {
            a[b.name] = (a[b.name] || 0) + b.count;
            return a
        }, {});

    var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

    if (_.size(duplicates)) {
        console.log("... duplicates exists. More then 2 if any:");
        _.forEach(duplicates, (duplicate) => {
            if (uniq[duplicate] > 2) {
                console.log(uniq[duplicate] + " " + duplicate);
            }
        });
    }
    return judges;
};
