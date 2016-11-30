"use strict";
const _ = require("lodash");
const slugify = require('transliteration').slugify;
const judgeModel = require("./../input/judge");
const homonyms = [
    "мельник олександр михайлович",
    "микуляк павло павлович"
];

function transliterateName(name) {
    return slugify(name, { lowercase: true, separator: '_', replace:  [["'", ''], ['"', ''], [';', ''], ['/', ''], ['’', '']]});
}

/**
 *
 * @param {Array} judges
 * @returns {Array}
 */
module.exports = function transliterateNames(judges) {
    console.log('Play The Imitation Game');
    judges.forEach(function (judge) {
        if (!_.includes(homonyms, _.toLower(judge[judgeModel.name]))) {
            judge.key = _.toLower(transliterateName(judge[judgeModel.name]));
        } else {
            judge.key = _.toLower(transliterateName(judge[judgeModel.name] + " " + judge[judgeModel.department]));
        }
    });
    return judges;
};
