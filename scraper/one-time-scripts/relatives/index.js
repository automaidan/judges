"use strict";
require("../../helpers/detect-debug");
const remoteCSVtoJSON = require("../../helpers/remote-csv-to-json");
const Promise = require("bluebird");
const _ = require("lodash");
const readdir = Promise.promisify(require("fs").readdir);
const json2csv = require("json2csv");
const writeFile = Promise.promisify(require("fs").writeFile);
const nazk = require('../../providers/public-api.nazk.gov.ua/crawler');
const levenshteinStringDistance = require("levenshtein-string-distance");
const csvGoogleSheetsLinkToFilteredJudgesNames = "https://docs.google.com/spreadsheets/d/171hH5f8VOieYG0mr0bCMGNn_8hYPRVYZNuX1TmoODrU/pub?gid=101304854&single=true&output=csv";
const COLUMNS = [
    "№ з/п",
    "Прізвище, ім’я, по батькові кандидата",
    "Найменування суду",
    "Посада",
    "Місце роботи/останнє місце роботи",
    "Область",
    "Родичі, вказані у декларації",
    "Співвласники чи власники, вказані у декларації"
];
const j = {
    id: "№ з/п",
    name: "Прізвище, ім’я, по батькові кандидата",
    relatives: "Родичі, вказані у декларації",
    coowners: "Співвласники чи власники, вказані у декларації"
};

function stringifyParse(object) {
    return JSON.parse(JSON.stringify(object));
}

// function itIsOk(aGiven, fetched) {
//     fetched = _.lowerCase(fetched);
//
//     return _.some(aGiven, (given) => {
//         given = _.lowerCase(_.trim(given[j.name]));
//         return levenshteinStringDistance(given, fetched) <= 3;
//     });
// }

function getJudgeName(declaration) {
    return `${declaration.step_1.lastname} ${declaration.step_1.firstname} ${declaration.step_1.middlename}`;
}

function judgeFinder() {

}

function getRelatives(declaration) {
    return "batman";

    const name = getJudgeName(declaration);

    const relatives = _.reduce(_.values(_.get(declaration, "step_2")), function (result, relavite) {
        return `${result} ${relavite.subjectRelation} ${relavite.firstname} ${relavite.middlename} ${relavite.lastname} ||||`;
    }, "");

    return `${name} – ${relatives}`;
}

function setRelatives(judges, id, relatives) {
    _.find(judges, {
        [j.id]: id
    })[j.relatives] = relatives;
}

function getCoowners() {
    return "superman";
}

function setCoowners(judges, id, coowners) {
    _.find(judges, {
        [j.id]: id
    })[j.coowners] = coowners;
}


function log(i, max) {
    if (i % 100 === 0) {
        console.log(`Scraped ${parseInt(i / max * 100, 10)}% of all judges.`)
    }
}


function findTheirDeclarations(judges) {
    let i = 0;

    return [

        judges,

        Promise.map(judges, judge => {
            log(i++, judges.length);
            return nazk({Name: judge[j.name]})
                .then(result => {
                    return {
                        id: judge[j.id],
                        declarations: _.map(result, "document")
                    }
                })
        }, {concurrency: 18})

    ]
}

function lookupNames(judges, declarationsResult) {

    _.forEach(declarationsResult, declarationsAndId => {
        setRelatives(judges, declarationsAndId.id, getRelatives(declarationsAndId.declarations));
        setCoowners(judges, declarationsAndId.id, getCoowners(declarationsAndId.declarations));
    });

    return [
        judges,
        declarationsResult
    ]
}

function saveCSV(judges, declarations) {
    let result = json2csv({data: judges, fields: COLUMNS});
    return writeFile(`./all-relatives.csv`, result);
}

Promise.resolve(csvGoogleSheetsLinkToFilteredJudgesNames)
    .then(remoteCSVtoJSON)
    .then(findTheirDeclarations)
    .spread(lookupNames)
    .spread(saveCSV)
    .then(() => {
        console.log("Done");
        process.exit(0);
    })
    .error(console.log)
    .catch(console.log);

// .spread(function (neededJudges, files) {
//     return Promise.reduce(files, function (result, file) {
//         return Promise.resolve(stringifyParse(require(fld + "/" + file)))
//             .then(declaration => {
//                 if (itIsOk(neededJudges, getJudgeName(declaration))) {
//                     console.log(getJudgeName(declaration));
//                     const relatives = getRelatives(declaration);
//                     if (relatives) {
//                         result.push(relatives);
//                     }
//                 }
//
//                 return result;
//             });
//     }, []);
// })
