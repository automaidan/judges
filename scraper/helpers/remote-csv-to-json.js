'use strict';
let fetch = require('node-fetch');
let csvtojson = require("csvtojson");
let Promise = require('bluebird');

/**
 * Helps fetch Google Docs data
 * @param link URI of CSV file
 * @return {Promise<Token>} A promise to the token.
 */
module.exports = function remoteCSVtoJSON(link) {
  return fetch(link)
    .then(response => response.text())
    .then(function (csv) {
      // if (!converter) {
      //   converter = new Converter.Converter({
      //     workerNum: global.isDebugging ? 1 : 4,
      //   });
      // }
      return new Promise(function (resolve, reject) {
        return csvtojson().fromString(csv, function (error, json) {
          if (error) {
            reject(error);
          }
          resolve(json);
        });
      });
    })
    .catch(console.log)
};
