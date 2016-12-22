"use strict";
let fetch = require('../../helpers/fetch-json');
let Promise = require('bluebird');
let _ = require("lodash");
let levenshteinStringDistance = require("levenshtein-string-distance");
let writeFile = Promise.promisify(require('fs').writeFile);
const NAME = "public-api.nazk.gov.ua";
const input = require("./../../input/index");
const output = require("./../../output/index");
const inJudgeModel = require("./../../input/judge.json");
const outJudgeModel = require("./../../output/judge.json");
const homonymsBlacklist = {
    antonenko_nataliya_oleksandrivna: [
        "b1d9f5fe-e996-4a3b-8d8e-9f75d13831f8"
    ],
    bespalov_oleksandr_oleksandrovich: [
        "f94752b0-7424-4b45-b6da-c8d2fec1fd11"
    ],
    voloshina_valentina_mikolayivna: [
        "166961a4-1331-4c83-8651-7c4b6f70e752"
    ],
    kovalenko_igor_volodimirovich: [
        "f3d6d4ba-702c-4de6-b3a4-9ef76c15d91a",
        "9128124c-4286-4d2c-bceb-1cd4e724a337"
    ],
    pavlenko_oksana_petrivna: [
        "910f627c-9d9f-4e70-90b9-9c371205d8f1"
    ],
    sotnikov_sergiy_viktorovich: [
        "b8cf2f8c-6337-422e-bc52-99fe95885fac"
    ],
    chorniy_oleksandr_mikolayovich: [
        "dd370d09-086b-4bc8-aaef-2c85e673a927",
        "14886a82-43c2-4f20-af25-ccebb34efcaa"
    ],
    melnik_oleksandr_mihaylovich_novomoskovskiy_miskrayonniy_dnipropetrovskoyi_oblasti: [
        "0a80428c-5247-4b1f-99c9-aa0e8c4b958c",
        "388949a9-a197-4b99-b0fd-fbb6422d8b71"
    ],
    melnik_oleksandr_mihaylovich_mikolayivskiy_okruzhniy_administrativniy_sud: [
        "0a80428c-5247-4b1f-99c9-aa0e8c4b958c",
        "50f8fe46-6cf8-4331-9c92-5be7d39d65c6"
    ],
    tkachenko_oleg_mikolayovich: ["efb72a4d-2f8a-4265-8341-29763365f515"],
    mikulyak_pavlo_pavlovich_zakarpatskiy_okruzhniy_administrativniy_sud: [],
    mikulyak_pavlo_pavlovich_uzhgorodskiy_miskrayonniy_sud_zakarpatskoyi_oblasti: ["80acf347-3f54-4364-92c7-e434e204b949"],
    savchenko_sergiy_ivanovich: [
        "1928fde2-67d6-4bdf-b7c2-2de8f5b0edf1"
    ],
    kucherenko_oksana_ivanivna: [
        "8cf77cc7-bd0f-49f7-a885-a2213625166a"
    ],
    shevchenko_oleksandr_volodimirovich: [
        "a8a23353-206a-45ce-8cee-633478323a5e",
        "153c9c19-cba7-42b4-87bc-a09c5e35d485",
        "c8d22a43-6eca-4aad-b557-f598158fc077",
        "46842bc6-491a-43b4-8a0a-d51c81fd7df2"
    ],
    vasilieva_lyubov_mikolayivna: [
        "53bd9d55-c537-4c4a-a8fa-d7b15c5df2e3"
    ],
    dyachuk_vasil_mikolayovich: ["9b83d351-f2a5-4c32-a5cc-304bde8f7ccd"]
};
function stringifyParse(object) {
    return JSON.parse(JSON.stringify(object));
}
function getSearchLink(s) {
    s = encodeURI(s);
    return `https://public-api.nazk.gov.ua/v1/declaration/?q=${s}`;
}
function getDeclarationLink(id) {
    return `https://public-api.nazk.gov.ua/v1/declaration/${id}`;
}


module.exports = function searchDeclaration(judge) {

    return fetch(getSearchLink(judge[inJudgeModel.name]))
    // return Promise.resolve(stringifyParse(require("./declarations-pointers-exapmle.json")))
        .then(response => {
            return _.chain(_.get(response, "items"))
                .filter(declarationPointer => {
                    const given = _.lowerCase(judge[inJudgeModel.name]);
                    const fetched = _.lowerCase(declarationPointer.lastname + " " + declarationPointer.firstname);
                    return levenshteinStringDistance(given, fetched) <= 3;
                })
                .filter(function (declarationPointer, index, declarations) {
                    return !_.includes(homonymsBlacklist[judge.key], declarationPointer.id);
                })
                .value();
        })
        .then(declarationPointers => {
            return Promise.map(declarationPointers, function (declarationPointer) {
                return fetch(getDeclarationLink(declarationPointer.id))
                // return Promise.resolve(stringifyParse(require("./declaration-exapmle.json")))
                    .then(serverResponse => {
                        serverResponse.data.id = serverResponse.id;
                        return writeFile(`../edeclarations/${serverResponse.id}.json`, JSON.stringify(serverResponse.data))
                            .then(() => {
                                return serverResponse.data;
                            });
                    })
            });
        })
        .then(declarations => {
            // declarations = filter declarationType ===1
            return _.sortBy(declarations, declaration => -parseInt(_.get(declaration, "step_0.declarationYear1"), 10));
        })
        .then(declarations => {
            return _.map(declarations, declaration => {
                return {
                    provider: NAME,
                    document: declaration
                };
            });
        })
        .catch(function (e) {
            throw new Error(e.message);
        })
};

//
// searchDeclaration({
//     Name: "Аліна Сніжана Степанівна",
//     key: "_abba",
// });
