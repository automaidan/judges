let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let tr = require('transliteration').transliterate;
let readFile = Promise.promisify(require('fs').readFile);

//const declarationsSuffix = '?format=json';
//const googleSheetsLinksFileModel = {
//    name: "name",
//    link: "link"
//};
const judgeModel = {
    'e2013': '2013',
    'source2013': 'Оригінал 2013',
    'e2014': '2014',
    'source2014': 'Оригінал 2014',
    'e2015': '2015',
    'source2015': 'Оригінал 2015',
    'number': 'number',
    'SNP': 'ПІБ',
    'position': 'Посада',
    'info': 'Примітки'
};

(function run() {
    fetchCountry()
        .then(function (judges) {
            return _.filter(judges, function (j) {
                return !!j[judgeModel.e2015] || !!j[judgeModel.e2014] || !!j[judgeModel.e2013];
            })
        })
        .then(function (judges) {
            judges.forEach(function (judge) {
                judge.name = transliterateName(judge[judgeModel.SNP]);
            });
            return judges;
        })
        .then(r => console.log(r.length))
        .catch(console.log);
})();

function fetchCountry() {
    return fetchRegion("./source/kyiv.json");
}

function fetchRegion(filePath) {
    return readFile(filePath, 'utf8')
        .then(function (data) {
            return Promise.reduce(JSON.parse(data), function (judges, kyivCourtsList) {
                return fetch(kyivCourtsList.link)
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
                    });
            }, []);
        });

}

function transliterateName(name) {
    return tr(name).split(' ').join('-')
}
