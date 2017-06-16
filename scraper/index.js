"use strict";
require("./helpers/detect-debug");
require("./settings-loader");
const Promise = require('bluebird');
const scrapJudgesList = require("./scrap-judges-list");
const fixJudgeNameLetterCase = require("./helpers/names-human-readable");
const howManyPhotos = require("./helpers/how-many-photos");
const checkDuplicates = require("./check-duplicates");
const scrapDeclarations = require("./scrap-declarations");
const analytics = require("./analytics");
const saveEachJudgeIntoJSON = require("./save-each-judge-into-json");
const printJudgesWithoutDeclarations = require("./print-judges-without-declarations");
const rePackJudges = require("./re-pack-judges");
const assignKeyBasedOnName = require("./helpers/names-transliterate");
const saveLocalJudgesJSON = require("./save-local-judges-json");
const createDictionary = require("./create-dictionary");
const zipJudges = require("./zip");
const regionDepartmentMapping = require("./region-department-mapping");
const scrapTexts = require("./scrap-texts");

Promise.all([
    Promise.resolve()
        .then(scrapJudgesList)
        .then(fixJudgeNameLetterCase)
        .then(checkDuplicates)
        .then(assignKeyBasedOnName)
        .then(howManyPhotos)
        .then(saveLocalJudgesJSON)
        .then(scrapDeclarations)
        .then(analytics)
        .then(saveEachJudgeIntoJSON)
        .then(printJudgesWithoutDeclarations)
        .then(rePackJudges)
        .then(createDictionary)
        .spread(zipJudges)
        .then(regionDepartmentMapping),
    scrapTexts()
])
    .spread(() => {
        console.log("Done");
        process.exit(0);
    })
    .error(console.log)
    .catch(console.log);
