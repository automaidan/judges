const nazkDatabase = require('../output/edeclarations.json');
const _ = require('lodash');

module.exports = function checkNazk(name) {
    return _.find(nazkDatabase, {name: _.lowerCase(name)});
};
