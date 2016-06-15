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
    texts: "../source/tests.json"
};
const judgeModel = require("./model/judge");

(function run() {
    getJudgesSource()
        .then(filterEmptyLines)
        .then(capitalizeNames)
        .then(checkDuplicates)
        .then(transliterateNames)
        .then(saveLocalJudgesJSONLocallyOnceMore)
        .then(searchDeclarations)
        .then(() => {
            console.log("Done");
            process.exit(0);
        })
        .then(console.log)
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
            return writeFile(input.cachedJudges, JSON.stringify(judges))
                .then(() => saveTimestampLabel(input.cachedJudges))
                .then(() => judges);
        });

}

function saveTimestampLabel (filePath) {
    return writeFile(filePath + ".timestamp", ""+ (new Date().getTime()));
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
        _.forEach(duplicates, (duplicate) => {
            console.log(uniq[duplicate] + " " + duplicate);
        });
        //throw new Error("Duplicates names");
    }
    return judges;
}

function searchDeclarations(judges) {
    console.log('searchTheirDeclarations');
    return Promise.reduce(judges, function (_judges, judge) {
        return saveDeclaration(judge)
            .then();
    }, []);
}

function saveDeclaration(judge) {
    if (!judge[judgeModel.name]) {
        Promise.resolve(false);
        return;
    }
    return fetch(getSearchLink(judge[judgeModel.name]))
        .then(response => response.text())
        .then(data => JSON.parse(data))
        .then(response => {
            response = _.get(response, "results.object_list");
            return _.filter(response, function (declaration) {
                return _.lowerCase(_.get(declaration, "general.full_name")) === _.lowerCase(judge[judgeModel.name]);
            })
        })
        .then(function (json) {
            return writeFile(`../declarations/${judge.key}.json`, JSON.stringify(json))
                .then(() => {
                    return {
                        len: json && json.length
                    }
                });
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
    return tr(name).split(' ').join('_');
}

function saveLocalJudgesJSONLocallyOnceMore(judges) {
    return writeFile(input.cachedJudges, JSON.stringify(judges))
        .then(() => judges);
}

function capitalizeNames(judges) {
    judges.forEach(function (judge) {
        judge[judgeModel.name] = capitalize(judge[judgeModel.name]);
    });
    return judges;
}

function capitalize(string) {
    return _.chain(string.split(" "))
        .map(_.capitalize)
        .reduce(function (name, n) {
            return name + n + " ";
        }, "")
        .value()
        .slice(0, -1);
}
