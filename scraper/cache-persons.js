'use strict';
let _ = require('lodash');
const config = require('./config');
let Promise = require('bluebird');
let writeFile = Promise.promisify(require('fs').writeFile);

const input = require('./input');

module.exports = function saveLocalJudgesJSON(persons) {
  if (config.get('READ_CACHE')) {
    return persons;
  }

  console.log('Save fetched persons list locally.');
  return writeFile(input.cachedList, JSON.stringify(persons))
    .then(() => persons);
};
