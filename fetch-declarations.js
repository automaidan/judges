let fetch = require('node-fetch');
let Converter = require("csvtojson");
let Promise = require('bluebird');
let _ = require("lodash");
let tr = require('transliteration').transliterate;
let readFile = Promise.promisify(require('fs').readFile);
let writeFile = Promise.promisify(require('fs').writeFile);

const declarationsSuffix = '?format=json';
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
        .then(function (judges) {
            return Promise.all(_.map(judges, saveDeclarations));
        })
        .then(r => console.log(r))
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

function saveDeclarations(judge) {
    return Promise.all([
        saveDeclaration(judge[judgeModel.e2013], "2013", judge.name),
        saveDeclaration(judge[judgeModel.e2014], "2014", judge.name),
        saveDeclaration(judge[judgeModel.e2015], "2015", judge.name)
    ])
}

function saveDeclaration(link, year, name) {
    if (!link) {
        Promise.resolve(false);
        return;
    }
    return fetch(link + declarationsSuffix)
        .then(response => response.text())
        .then(function (text) {
            return writeFile(`./declarations/${year}/${name}.json`, text);
        })
        .catch(function () {
            return false;
        })
}

function transliterateName(name) {
    return tr(name).split(' ').join('-');
}
