"use strict";
const _ = require("lodash");
const slugify = require('transliteration').slugify;
const personModel = require("./../input/person");
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
        if (!_.includes(homonyms, _.toLower(judge[personModel.name]))) {
            judge.key = _.toLower(transliterateName(judge[personModel.name]));
        } else {
            judge.key = _.toLower(transliterateName(judge[personModel.name] + " " + judge[personModel.department]));
        }
    });
    return judges;
};
