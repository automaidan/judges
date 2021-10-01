const fetch = require("node-fetch");
const csvtojson = require("csvtojson");

/**
 * Helps fetch Google Docs data
 * @param link URI of CSV file
 * @return {Promise<Token>} A promise to the token.
 */
module.exports = function remoteCSVtoJSON(link) {
  return fetch(link)
    .then((response) => response.text())
    .then((csv) => csvtojson().fromString(csv))
    .catch(console.log);
};
