'use strict';
let Promise = require('bluebird');
let _ = require('lodash');


const personModel = require('../input/person');

/**
 *
 * @param {String} string
 * @returns {Array|T[]|JQuery|Array.<T>|string|LoDashExplicitArrayWrapper<T>|any}
 */
function normalize(string) {
    string = _.toLower(string);

    return _.chain(string.split(' '))
        .map(_.capitalize)
        .reduce(function (name, n) {

            name = _.replace(name, 'doubleOnedoube', '’');
            name = _.replace(name, '`', '’');

            //Fix for Double-surnames (like Малахова-онуфер) lowercased issue
            if (_.includes(n, '-')) {
                n = n.split('-').map(_.capitalize).join('-');
            }

            return name + n + ' ';
        }, '')
        .value()
        .slice(0, -1);
}

/**
 *
 * @param {Array} persons
 * @returns {Array}
 */
module.exports = function makeNameHumanReadable(persons) {
    console.log('Make names look like names.');
    persons.forEach(function (judge) {
        judge[personModel.name] = normalize(judge[personModel.name]);
    });
    return persons;
};
