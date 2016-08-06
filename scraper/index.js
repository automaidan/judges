"use strict";
const Promise = require('bluebird');
const scrapJudgesList = require("./scrap-judges-list");
const makeNameHumanReadable = require("./helpers/names-human-readable");
const checkDuplicates = require("./check-duplicates");
const scrapDeclarations = require("./scrap-declarations");
const transliterateNames = require("./helpers/names-transliterate");
const saveLocalJudgesJSON = require("./save-local-judges-json");
const createDictionary = require("./create-dictionary");
const zipJudges = require("./zip");

const scrapTexts = require("./scrap-texts");

Promise.all([
    scrapJudgesList()
        .then(makeNameHumanReadable)
        .then(checkDuplicates)
        .then(transliterateNames)
        .then(saveLocalJudgesJSON)
        .then(scrapDeclarations)
        .then(createDictionary)
        .spread(zipJudges),
    scrapTexts()
])
    .spread(() => {
        console.log("Done");
        process.exit(0);
    })
    .error(console.log)
    .catch(console.log);
