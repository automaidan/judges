'use strict';
let _ = require('lodash');

module.exports = function howManyPhoto(persons) {
    const stat = _.countBy(persons, function (person) {
        return !!person['Фото'];
    });

    console.log(`${stat[true]} judges has photo and ${stat[false]} judges doesn't.`)

    return persons;
};
