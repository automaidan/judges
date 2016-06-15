let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let tr = require('transliteration').transliterate;
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);

const listOfAllRegionsUkrainianJudges = "./source/all-ukraine-judges-csv-links.json";
const listOfAllRegionsUkrainianJudgesLocalJSON = "../judges.json";
const googleSheetsLinksFileModel = {
    key: "key",
    link: "link"
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
        .then(console.log)
        .catch(console.log);
})();

function getJudgesSource() {
    if (process.env.LOCAL_JUDGES_JSON) {
        return readFile(listOfAllRegionsUkrainianJudgesLocalJSON, 'utf8')
            .then(data => JSON.parse(data))
    }

    return readFile(listOfAllRegionsUkrainianJudges, 'utf8')
        .then(function (data) {
            return Promise.reduce(JSON.parse(data), function (judges, judge) {
                console.log(judge[googleSheetsLinksFileModel.link]);
                return fetch(judge[googleSheetsLinksFileModel.link])
                    .then(response => response.text())
                    .then(function (csv) {
                        let converter = new Converter.Converter({
                            workerNum: 4
                        });
                        return new Promise(function (resolve, reject) {
                            return converter.fromString(csv, function (error, json) {
                                if (error) {
                                    reject(error);
                                }
                                resolve(judges.concat(json));
                            });
                        });
                    })
            }, []);
        })
        .then(function (judges) {
            return writeFile(listOfAllRegionsUkrainianJudgesLocalJSON, JSON.stringify(judges))
                .then(() => writeFile(listOfAllRegionsUkrainianJudgesLocalJSON + ".timestamp", ""+ (new Date().getTime())))
                .then(() => judges);
        });

}

function filterEmptyLines(judges) {
    console.log('filterEmptyLines');
    return _.filter(judges, judge => judge[judgeModel.name] && !/\d/.test(judge[judgeModel.name]))
}

function checkDuplicates(judges) {
    console.log('duplicates');
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
        console.log(duplicates);
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
        judge.key = transliterateName(judge[judgeModel.name]);
    });
    return judges;
}

function transliterateName(name) {
    return tr(name).split(' ').join('');
}

function saveLocalJudgesJSONLocallyOnceMore(judges) {
    return writeFile(listOfAllRegionsUkrainianJudgesLocalJSON, JSON.stringify(judges))
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
