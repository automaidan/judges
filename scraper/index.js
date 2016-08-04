"use strict";
const Promise = require('bluebird');
const getJudgesSource = require("./judges-source");
const makeNameHumanReadable = require("./human-readable-names");
const checkDuplicates = require("./check-duplicates");
const scrapDeclarations = require("./scrap-declarations");
const transliterateNames = require("./transliterate-names");
const saveLocalJudgesJSON = require("./save-local-judges-json");
const createDictionary = require("./transliterate-names");
const zipJudges = require("./zip");

const getTextsSource = require("./text-source");

Promise.all([
    getJudgesSource()
        .then(makeNameHumanReadable)
        .then(checkDuplicates)
        .then(transliterateNames)
        .then(saveLocalJudgesJSON)
        .then(scrapDeclarations)
        .then(createDictionary)
        .spread(zipJudges),
    getTextsSource()
])
    .spread(() => {
        console.log("Done");
        process.exit(0);
    })
    .error(console.log)
    .catch(console.log);
