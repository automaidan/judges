"use strict";
let Promise = require('bluebird');
let _ = require("lodash");


const judgeModel = require("./model/judge");

/**
 *
 * @param {String} string
 * @returns {Array|T[]|JQuery|Array.<T>|string|LoDashExplicitArrayWrapper<T>|any}
 */
function normalize(string) {
    string = _.toLower(string);

    string = _.chain(string.split("-"))
        .map(_.capitalize)
        .reduce(function (name, n) {
            return name + n + "-";
        }, "")
        .value()
        .slice(0, -1);

    return _.chain(string.split(" "))
        .map(_.capitalize)
        .reduce(function (name, n) {
            return name + n + " ";
        }, "")
        .value()
        .slice(0, -1);
}

/**
 *
 * @param {Array} judges
 * @returns {Array}
 */
module.exports = function makeNameHumanReadable(judges) {
    judges.forEach(function (judge) {
        judge[judgeModel.name] = normalize(judge[judgeModel.name]);
    });
    return judges;
};
