"use strict";
let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let slugify = require('transliteration').slugify;
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

(function run() {
    Promise.all([
            getJudgesSource()
                .then(filterEmptyLines)
                .then(normalizeNames)
                .then(checkDuplicates)
                .then(transliterateNames)
                .then(saveLocalJudgesJSONLocallyOnceMore)
                .then(searchDeclarationsAndWriteInFiles)
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
})();

function getJudgesSource() {
    if (process.env.LOCAL_JUDGES_JSON) {
        console.log("Use cached judges JSON.");
        return readFile(input.cachedJudges, 'utf8')
            .then(data => JSON.parse(data))
    }

    return readFile(input.judgesPerRegionCSVLinksArray, 'utf8')
        .then(function (data) {
            return Promise.reduce(JSON.parse(data), function (regions, region) {
                console.log("Fetching: " + region.name);
                return remoteCSVtoJSON(region.link)
                    .then((json) => regions.concat(json));
            }, []);
        })
        .then(function (judges) {
            var content = JSON.stringify(judges);
            return writeFile(input.cachedJudges, content)
                .then(() => saveTimestampLabel(input.cachedJudges, content))
                .then(() => judges);
        });
}

function getTextsSource () {
    console.log("getTextsSource");
    return remoteCSVtoJSON(input.textsCSV)
        .then(function (texts) {
            console.log("getTextsSource:texts");
            var textsKeyValue = {};
            _.forEach(texts, (text) => {
                textsKeyValue[text.key] = text.ukr;
            });
            var content = JSON.stringify(textsKeyValue);
            return writeFile(output.texts, content)
                .then(() => saveTimestampLabel(output.texts, content))
                .then(() => texts);
        });
}

function saveTimestampLabel (filePath, content) {
    return readFile(filePath, 'utf8')
        .then(oldContent => {
            if (content !== oldContent) {
                return writeFile(filePath + ".timestamp", ""+ (new Date().getTime()));
            }
        });
}

function filterEmptyLines(judges) {
    console.log('filterEmptyLines');
    return _.filter(judges, judge => judge[judgeModel.name] && !/\d/.test(judge[judgeModel.name]))
}

function checkDuplicates(judges) {
    console.log('Duplicates');
    var uniq = judges
        .map((judge) => {
            return {count: 1, name: judge[judgeModel.name]}
        })
        .reduce((a, b) => {
            a[b.name] = (a[b.name] || 0) + b.count;
            return a
        }, {});

    var duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);

    if (_.size(duplicates)) {
        console.log("... duplicates exists. More then 2 if any:");
        _.forEach(duplicates, (duplicate) => {
            if (uniq[duplicate] > 2) {
                console.log(uniq[duplicate] + " " + duplicate);
            }
        });
    }
    return judges;
}

function searchDeclarationsAndWriteInFiles(judges) {
    console.log('searchTheirDeclarations');
    return Promise.reduce(judges, function (_judges, judge) {
        return searchDeclaration(judge)
            .then(function (json) {
                judge.declarations = json;
                judge.declarationsLength = json && json.length;
                return writeFile(`../judges/${judge.key}.json`, JSON.stringify(judge))
                    .then(function () {
                        _judges.push({
                            d: judge[judgeModel.department], // department
                            p: judge[judgeModel.position], // position
                            r: judge[judgeModel.region], // region
                            n: judge[judgeModel.name], // Surname Name Patronymic
                            k: judge[judgeModel.key] // key of JSON file under http://prosud.info/judges/AbdukadirovaKarineEskenderivna.json
                        });
                        return _judges;
                    });
            })
    }, []);
}

function searchDeclaration(judge) {
    if (!judge[judgeModel.name]) {
        Promise.resolve(false);
        return;
    }
    // TODO add hack with readFile(`../declarations/${judge.key}.json`, 'utf8')
    return fetch(getSearchLink(judge[judgeModel.name]))
        .then(response => response.text())
        .then(data => JSON.parse(data))
        .then(response => {
            response = _.get(response, "results.object_list");
            return _.filter(response, function (declaration) {
                return _.lowerCase(_.get(declaration, "general.full_name")) === _.lowerCase(judge[judgeModel.name]);
            })
        })
        .then(judge => {
            return writeFile(`../declarations/${judge.key}.json`, JSON.stringify(judge))
                .then(() => judge);
        })
        .catch(function (e) {
            throw new Error(e.message);
        })
}

function getSearchLink(s) {
    console.log("search " + s);
    s = encodeURI(s);
    return `http://declarations.com.ua/search?q=${s}&format=json`;
}

function transliterateNames(judges) {
    console.log('transliterateNames');
    judges.forEach(function (judge) {
        judge.key = _.toLower(transliterateName(judge[judgeModel.name]));
    });
    return judges;
}

function transliterateName(name) {
    return slugify(name, { lowercase: true, separator: '_', replace:  [["'", ''], ['"', ''], [';', ''], ['/', ''], ['’', '']]});
}

function saveLocalJudgesJSONLocallyOnceMore(judges) {
    return writeFile(input.cachedJudges, JSON.stringify(judges))
        .then(() => judges);
}

function normalizeNames(judges) {
    judges.forEach(function (judge) {
        judge[judgeModel.name] = normalize(judge[judgeModel.name]);
    });
    return judges;
}

function normalize(string) {
    string = _.toLower(string);

    return _.chain(string.split(" "))
        .map(_.capitalize)
        .reduce(function (name, n) {
            return name + n + " ";
        }, "")
        .value()
        .slice(0, -1);
}

function createDictionary (judges) {
    var d = _.uniq(_.map(judges, 'd'));
    var p = _.uniq(_.map(judges, 'p'));
    var r = _.uniq(_.map(judges, 'r'));

    var dictionary = _.keyBy(d.concat(p).concat(r), function() {
        return _.uniqueId();
    });

    var correctedDictionary = _.mapValues(dictionary, function (value) {
        return _.toString(value);
    });

    var content = JSON.stringify(correctedDictionary);
    return writeFile(output.dictionary, content)
        .then(() => saveTimestampLabel(output.dictionary, content))
        .then(() => [judges, _.invert(dictionary)]);
}

function zipJudges (judges, dictionary) {
    judges = _.map(judges, (judge) => {
        return {
            d: _.get(dictionary, judge.d), // department
            p: _.get(dictionary, judge.p), // position
            r: _.get(dictionary, judge.r), // region
            n: judge.n, // Surname Name Patronymic
            k: judge.k // key of JSON file under http://prosud.info/declarations/AbdukadirovaKarineEskenderivna.json
        };
    });

    var content = JSON.stringify(judges);
    return writeFile(output.judges, content)
        .then(() => saveTimestampLabel(output.judges, content))
        .then(() => judges);
}
