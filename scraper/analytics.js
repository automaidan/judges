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
    landownerByLands: function landownerByLands(judge) {
        var result = 0;

        if (isEmptiness(judge)) {
            return result;
        }
        var declaration2014 = get2014Declaration(judge);
        if (!declaration2014) {
            return result;
        }
        if(!_.has(declaration2014,"estate.23") || _.isNull(_.get(declaration2014,"estate.23"))){
            return result;
        }

        result = _.reduce(declaration2014.estate["23"], function (sum, land) {
            var space = _.toNumber(land.space);

            if (_.lowerCase(land.space_units) === "га") {
                space *= 10000;
            }
            //if (_.lowerCase(land.space_units) !== "га" || _.lowerCase(land.space_units) !== "м2" || land.space_units != "м²") {
            //    throw new Error("space unit " + land.space_units);
            //}

            return sum + space;
        }, result);

        return result;
    },

    commonFamilyIncome: function commonFamilyIncome(judge) {
        var result = 0;

        if (isEmptiness(judge)) {
            return result;
        }
        var declaration2014 = get2014Declaration(judge);
        if (!declaration2014 || !declaration2014.income["5"]) {
            return result;
        }

        return result + _.toNumber(declaration2014.income["5"].value) + _.toNumber(declaration2014.income["5"].family);
    },

    houseArea: function houseArea(judge) {
        var result = 0;

        if (isEmptiness(judge)) {
            return result;
        }
        var declaration2014 = get2014Declaration(judge);
        if (!declaration2014) {
            return result;
        }

        _.reduce(declaration2014.estate, function (sum, land) {
            return sum + _.toNumber(land.space);
        }, result);

        return result;
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
                //judge.landOwnerIndex = getIndex.landownerByLands(judge);
                judge.incomeIndex = getIndex.commonFamilyIncome(judge);
                //judge.houseIndex = getIndex.houseArea(judge);

                retur judgen
            })
    }, []);
}


function loadJudge(judge) {
    return readFile(`../judges/${judge.key}.json`, 'utf8')
        .then(data => JSON.parse(data))
        .catch(function (e) {
            throw new Error(e.message);
        })
}

function get2014Declaration (judge) {
    return _.filter(judge.declarations, function (declaration) {
        return _.get(declaration, "intro.declaration_year") === "2014" || _.get(declaration, "intro.declaration_year") == 2014;
    })[0]
}
