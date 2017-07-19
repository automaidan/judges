'use strict';
const fetch = require('node-fetch');
const Promise = require('bluebird');
const _ = require('lodash');
const writeFile = Promise.promisify(require('fs').writeFile);

const input = require('./input');
const output = require('./output');

/**
 *
 * @param {Array} persons
 * @returns {Promise<Array>}
 */
module.exports = function createDictionary (persons) {
    console.log('Create minimized dictionary');
    let d = _.uniq(_.map(persons, 'd'));
    let p = _.uniq(_.map(persons, 'p'));
    let r = _.uniq(_.map(persons, 'r'));

    let dictionary = _.keyBy(d.concat(p).concat(r), function() {
        return _.uniqueId();
    });

    let correctedDictionary = _.mapValues(dictionary, function (value) {
        return _.toString(value);
    });

    return Promise.resolve(JSON.stringify(correctedDictionary))
        .then((content) => writeFile(output.dictionary, content))
        .then(() => [persons, _.invert(dictionary)]);
};
