"use strict";
let fetch = require('../../helpers/fetch-json');
let Promise = require('bluebird');
let _ = require("lodash");
let writeFile = Promise.promisify(require('fs').writeFile);
let levenshteinStringDistance = require("levenshtein-string-distance");
const NAME = "declarations.com.ua";
const input = require("./../../input/index");
const output = require("./../../output/index");
const inJudgeModel = require("./../../input/judge.json");
const outJudgeModel = require("./../../output/judge.json");
const homonymsBlacklistDeclarationsComUaKeys = {
    melnik_oleksandr_mihaylovich_novomoskovskiy_miskrayonniy_dnipropetrovskoyi_oblasti: ["vulyk_66_51", "vulyk_11_177"],
    melnik_oleksandr_mihaylovich_mikolayivskiy_okruzhniy_administrativniy_sud: ["vulyk_77_27", "vulyk_11_177"],
    tkachenko_oleg_mikolayovich: ["vulyk_30_158"],
    mikulyak_pavlo_pavlovich_zakarpatskiy_okruzhniy_administrativniy_sud: ["vulyk_68_5"],
    mikulyak_pavlo_pavlovich_uzhgorodskiy_miskrayonniy_sud_zakarpatskoyi_oblasti: ["vulyk_67_185"],
    shevchenko_oleksandr_volodimirovich: ["vulyk_35_200"],
    dyachuk_vasil_mikolayovich: ["vulyk_28_124"]
};
function getSearchLink(s) {
    s = encodeURI(s);
    return `http://declarations.com.ua/search?q=${s}&format=json`;
}

module.exports = function searchDeclaration(judge) {

    return fetch(getSearchLink(judge[inJudgeModel.name]))
        .then(response => {
            var uniq, duplicatedYears, groupedDuplicates;

            return _.chain(_.get(response, "results.object_list"))
                .filter(declaration => {
                    var given = _.lowerCase(judge[inJudgeModel.name]);
                    var fetched = _.lowerCase(_.get(declaration, "general.full_name"));
                    return levenshteinStringDistance(given, fetched) <= 1;
                })
                .tap(declarations => {
                    uniq = _.countBy(response, d => _.get(d, "intro.declaration_year"));
                    duplicatedYears = Object.keys(uniq).filter((a) => uniq[a] > 1);
                    if (_.size(duplicatedYears)) {
                        groupedDuplicates = _.groupBy(response, d => _.get(d, "intro.declaration_year"));
                    }
                    return declarations;
                })
                .filter(function (declaration, index, declarations) {
                    if (_.size(duplicatedYears) && _.includes(duplicatedYears, _.get(declaration, "intro.declaration_year"))) {
                        debugger;
                    }
                    if (_.includes(homonymsBlacklistDeclarationsComUaKeys[judge.key], declaration.id)) {
                        return false;
                    }
                    return true;
                })
                .sortBy(declaration => -parseInt(_.get(declaration, "intro.declaration_year"), 10))
                .value();
        })
        .then(declarations => {
            return writeFile(`../declarations/${judge.key}.json`, JSON.stringify(declarations))
                .then(() => {
                    return _.map(declarations, declaration => {
                        return {
                            provider: NAME,
                            document: declaration
                        };
                    });
                });
        })
        .catch(function (e) {
            throw new Error(e.message);
        })
};


var a = {
    "PATH": "/opt/local/bin:/opt/local/sbin:/Users/max/.npm-packages/bin:/opt/local/bin:/opt/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/mongodb/bin",
    "PKG_CONFIG_PATH": "/usr/local/opt/cairo/lib/pkgconfig/:/usr/local/lib/pkgconfig:/usr/X11/lib/pkgconfig/:",
    "FORCE_COLOR": "true",
    "DEBUG_FD": "1",
    "ELECTRON_NO_ATTACH_CONSOLE": "true",
    "DEBUG_COLORS": "true",
    "MOCHA_COLORS": "1",
    "VERSIONER_PYTHON_VERSION": "2.7",
    "LOGNAME": "max",
    "XPC_SERVICE_NAME": "com.jetbrains.WebStorm.5052",
    "PWD": "/Users/max/WebstormProjects/judges/scraper",
    "NVM_DIR": "/Users/max/.nvm",
    "SHELL": "/bin/bash",
    "HOMEBREW_GITHUB_API_TOKEN": "2a2ce83fe79ed9495c08e712f990574201c3ce16",
    "GITHUB_TOKEN": "ca89f21d8b28a5cbc224136a27036c93f6298f92",
    "MONGO_PATH": "/usr/local/mongodb",
    "VERSIONER_PYTHON_PREFER_32_BIT": "no",
    "USER": "max",
    "TMPDIR": "/var/folders/y6/yrx5x5_11j3dqfwpbvp_pr880000gp/T/",
    "SSH_AUTH_SOCK": "/private/tmp/com.apple.launchd.YsxoGeZJzk/Listeners",
    "XPC_FLAGS": "0x0",
    "__CF_USER_TEXT_ENCODING": "0x1F6:0x0:0x0",
    "Apple_PubSub_Socket_Render": "/private/tmp/com.apple.launchd.FN70EqhgL7/Render",
    "LC_CTYPE": "en_US.UTF-8",
    "HOME": "/Users/max"
}
