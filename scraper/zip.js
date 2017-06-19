"use strict";
let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);

const input = require("./input");
const output = require("./output");

/**
 *
 * @param {Array} persons
 * @param {Array} dictionary
 * @returns {Promise<Array>}
 */
module.exports = (persons, dictionary) => {
    console.log("Zip persons.");
    persons = _.map(persons, (person) => {
        return {
            d: _.get(dictionary, person.d), // department
            p: _.get(dictionary, person.p), // position
            r: _.get(dictionary, person.r), // region
            n: person.n, // Surname Name Patronymic
            k: person.k, // key of JSON file under http://prosud.info/persons/key.json
            s: person.s, // Stigma
            a: person.a // Analytics
        };
    });

    return Promise.resolve(JSON.stringify(persons))
        .then((content) => writeFile(output.judges, content))
        .then(() => persons);
};
