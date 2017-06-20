"use strict";
const _ = require("lodash");

/**
 *
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function printNoDeclarations(persons) {
    console.log('Print persons names without declarations');

    _.forEach(persons, function (person) {
        if (person && (!person.declarations || !_.size(person.declarations))) {
            console.log("Person without declarations: " + person.Name);
        }
    });

    return Promise.resolve(persons);
};
