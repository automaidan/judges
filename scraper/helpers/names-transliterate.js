"use strict";
const _ = require("lodash");
const slugify = require('transliteration').slugify;
const judgeModel = require("./../input/judge");

function transliterateName(name) {
    return slugify(name, { lowercase: true, separator: '_', replace:  [["'", ''], ['"', ''], [';', ''], ['/', ''], ['’', '']]});
}

/**
 *
 * @param {Array} judges
 * @returns {Array}
 */
module.exports = function transliterateNames(judges) {
    console.log('transliterateNames');
    judges.forEach(function (judge) {
        if ('мельник олександр михайлович' !== _.toLower(judge[judgeModel.name])) {
            judge.key = _.toLower(transliterateName(judge[judgeModel.name]));
        } else {
            judge.key = _.toLower(transliterateName(judge[judgeModel.name] + " " + judge[judgeModel.region]));
        }
    });
    return judges;
};
