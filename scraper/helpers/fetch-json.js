"use strict";
let fetch = require('node-fetch');
module.exports = function searchDeclaration(link) {
    return fetch(link)
        .then(response => response.text())
        .then(data => JSON.parse(data))
};
