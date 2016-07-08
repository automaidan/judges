"use strict";
let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let tr = require('transliteration').transliterate;
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);
let remoteCSVtoJSON = require("./remote-csv-to-json");

const input = {
    judgesPerRegionCSVLinksArray: "./input/all-ukraine-judges-csv-links.json",
    cachedJudges: "./input/all-ukraine-judges.json",
    textsCSV: "https://docs.google.com/spreadsheets/d/1SDFmxJEo3Al4-dTS4PkA_E88bH40keZFfIcoT2mVOO4/pub?gid=0&single=true&output=csv"
};
const output = {
    judges: "../source/judges.json",
    dictionary: "../source/dictionary.json",
    texts: "../source/texts.json"
};
const judgeModel = require("./model/judge");

function isEmptiness (judge) {
    return !judge.declarations || !_.size(judge.declarations);
}

var getIndex = {
    landownerByLands: function rankLandownerIndex(judge) {
        var result = 0;

        if (isEmptiness(judge)) {
            return result;
        }

        return result;
    },

    commonFamilyIncome: function rankCommonIncome(judge) {

    },

    houseArea: function rankHouseArea(judge) {

    }

};

(function run() {
    return getJudgesSource()
        .then(loadJudges)
        .spread(() => {
            console.log("Done");
            process.exit(0);
        })
        .error(console.log)
        .catch(console.log);
})();

function getJudgesSource() {
    return readFile(input.cachedJudges, 'utf8')
        .then(data => JSON.parse(data))
}


function loadJudges(judges) {
    console.log('loadJudges');
    return Promise.reduce(judges, function (_judges, judgeData) {
        return loadJudge(judgeData)
            .then(function (judge) {
                console.log(judge)
            })
    }, []);
}


function loadJudge(judge) {
    return readFile(`../declarations/${judge.key}.json`, 'utf8')
        .then(data => JSON.parse(data))
        .catch(function (e) {
            throw new Error(e.message);
        })
}
