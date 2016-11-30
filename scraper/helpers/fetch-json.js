"use strict";
let fetch = require('node-fetch');
module.exports = function searchDeclaration(link) {
    return fetch(link)
        .then(response => response.text())
        .then(data => JSON.parse(data))
        .catch((err) => {
            console.log(err);
            console.log("...But, I gotta keep trying, and never give up!");
            return module.exports(link);
        })
};
