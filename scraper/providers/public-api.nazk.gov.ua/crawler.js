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
const homonymsBlacklistDeclarationsComUaKeys = {
    melnik_oleksandr_mihaylovich_novomoskovskiy_miskrayonniy_dnipropetrovskoyi_oblasti: ["vulyk_66_51", "vulyk_11_177"],
    melnik_oleksandr_mihaylovich_mikolayivskiy_okruzhniy_administrativniy_sud: ["vulyk_77_27", "vulyk_11_177"],
    tkachenko_oleg_mikolayovich: ["vulyk_30_158"],
    mikulyak_pavlo_pavlovich_zakarpatskiy_okruzhniy_administrativniy_sud: ["vulyk_68_5"],
    mikulyak_pavlo_pavlovich_uzhgorodskiy_miskrayonniy_sud_zakarpatskoyi_oblasti: ["vulyk_67_185"],
    shevchenko_oleksandr_volodimirovich: ["vulyk_35_200"],
    dyachuk_vasil_mikolayovich: ["vulyk_28_124"]
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
    // return Promise.resolve(stringifyParse({"page":{"currentPage":1,"batchSize":400,"totalItems":1},"items":[{"id":"dcdd7efa-1d71-41f8-81be-2bc6c8e1dcab","firstname":"\u041e\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440 \u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432\u0438\u0447","lastname":"\u0410\u0447\u043a\u0430\u0441\u043e\u0432","placeOfWork":"\u0417\u0430\u043f\u043e\u0440\u0456\u0437\u044c\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d\u043d\u0438\u0439 \u0441\u0443\u0434 \u0417\u0430\u043f\u043e\u0440\u0456\u0437\u044c\u043a\u043e\u0457 \u043e\u0431\u043b\u0430\u0441\u0442\u0456","position":"\u0421\u0443\u0434\u0434\u044f","linkPDF":"https:\/\/public.nazk.gov.ua\/storage\/documents\/pdf\/d\/c\/d\/d\/dcdd7efa-1d71-41f8-81be-2bc6c8e1dcab.pdf"}],"server_info":{"apiPublic":{"exec_time":7221.024,"memory_usage":599.08,"user_ip":"91.234.37.56"}}}))
        .then(response => {
            var uniq, duplicatedYears, groupedDuplicates;

            return _.filter(_.get(response, "items"), declarationPointer => {
                    var given = _.lowerCase(judge[inJudgeModel.name]);
                    var fetched = _.lowerCase(declarationPointer.lastname + " " + declarationPointer.firstname);
                    return levenshteinStringDistance(given, fetched) <= 1000;
                })
                // .tap(declarationPointers => {
                //     uniq = _.countBy(response, d => _.get(d, "intro.declaration_year"));
                //     duplicatedYears = Object.keys(uniq).filter((a) => uniq[a] > 1);
                //     if (_.size(duplicatedYears)) {
                //         groupedDuplicates = _.groupBy(response, d => _.get(d, "intro.declaration_year"));
                //     }
                //     return declarations;
                // })
                // .filter(function (declarationPointers, index, declarations) {
                //     if (_.size(duplicatedYears) && _.includes(duplicatedYears, _.get(declarationPointers, "intro.declaration_year"))) {
                //         debugger;
                //     }
                //     if (_.includes(_.keys(homonymsBlacklistDeclarationsComUaKeys[judge.key]), judge.key)) {
                //         debugger;
                //     }
                //     return true;
                // })

        })
        .then(declarationPointers => {
            return Promise.map(declarationPointers, function (declarationPointer) {
                return fetch(getDeclarationLink(declarationPointer.id))
                // return Promise.resolve(stringifyParse({"id":"dcdd7efa-1d71-41f8-81be-2bc6c8e1dcab","created_date":"25.10.2016","lastmodified_date":"25.10.2016","data":{"step_0":{"declarationType":"1","declarationYear1":"2015"},"step_1":{"city":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","region":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","country":"1","cityPath":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","cityType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","district":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","lastname":"\u0410\u0447\u043a\u0430\u0441\u043e\u0432","postCode":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","postType":"","workPost":"\u0421\u0443\u0434\u0434\u044f","firstname":"\u041e\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440","workPlace":"\u0417\u0430\u043f\u043e\u0440\u0456\u0437\u044c\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d\u043d\u0438\u0439 \u0441\u0443\u0434 \u0417\u0430\u043f\u043e\u0440\u0456\u0437\u044c\u043a\u043e\u0457 \u043e\u0431\u043b\u0430\u0441\u0442\u0456","middlename":"\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432\u0438\u0447","streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","changedName":false,"countryPath":"","eng_postCode":"","postCategory":"","actual_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","actual_cityPath":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","actual_cityType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","actual_postCode":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","actual_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","previous_lastname":"","corruptionAffected":"\u0422\u0430\u043a","eng_actualPostCode":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","previous_firstname":"","city_extendedstatus":"1","previous_middlename":"","responsiblePosition":"\u0421\u0443\u0434\u0434\u044f \u0441\u0443\u0434\u0443 \u0437\u0430\u0433\u0430\u043b\u044c\u043d\u043e\u0457 \u044e\u0440\u0438\u0441\u0434\u0438\u043a\u0446\u0456\u0457, \u0441\u0443\u0434\u0434\u044f \u041a\u043e\u043d\u0441\u0442\u0438\u0442\u0443\u0446\u0456\u0439\u043d\u043e\u0433\u043e \u0421\u0443\u0434\u0443 \u0423\u043a\u0440\u0430\u0457\u043d\u0438","sameRegLivingAddress":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","postType_extendedstatus":"1","eng_sameRegLivingAddress":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","housePartNum_extendedstatus":"1","postCategory_extendedstatus":"1"},"step_2":{"empty":"\u0423 \u0441\u0443\u0431'\u0454\u043a\u0442\u0430 \u0434\u0435\u043a\u043b\u0430\u0440\u0443\u0432\u0430\u043d\u043d\u044f \u0432\u0456\u0434\u0441\u0443\u0442\u043d\u0456 \u043e\u0431'\u0454\u043a\u0442\u0438 \u0434\u043b\u044f \u0434\u0435\u043a\u043b\u0430\u0440\u0443\u0432\u0430\u043d\u043d\u044f \u0432 \u0446\u044c\u043e\u043c\u0443 \u0440\u043e\u0437\u0434\u0456\u043b\u0456."},"step_3":{"1477315323901":{"city":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","person":"1","region":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","rights":{"1":{"citizen":"","ua_city":"","ua_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ua_lastname":"","ua_postCode":"","eng_fullname":"","eng_lastname":"","eng_postCode":"","rightBelongs":"1","ua_firstname":"","ukr_fullname":"","ukr_lastname":"","eng_firstname":"","ownershipType":"\u0412\u043b\u0430\u0441\u043d\u0456\u0441\u0442\u044c","ua_middlename":"","ua_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ukr_firstname":"","eng_middlename":"","otherOwnership":"","ukr_middlename":"","rights_cityPath":"","ua_company_name":"","eng_company_name":"","ukr_company_name":"","percent-ownership":"100","ua_street_extendedstatus":"","ua_houseNum_extendedstatus":"","ua_postCode_extendedstatus":"","eng_postCode_extendedstatus":"","ua_middlename_extendedstatus":"","eng_middlename_extendedstatus":"","ukr_middlename_extendedstatus":"","ua_housePartNum_extendedstatus":"","ua_apartmentsNum_extendedstatus":""}},"country":"1","cityPath":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","costDate":"","district":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","postCode":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","totalArea":"54,14","ua_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","objectType":"\u041a\u0432\u0430\u0440\u0442\u0438\u0440\u0430","owningDate":"07.06.2005","ua_cityType":"\u0417\u0430\u043f\u043e\u0440\u0456\u0436\u0436\u044f \/ \u0417\u0430\u043f\u043e\u0440\u0456\u0437\u044c\u043a\u0430 \u041e\u0431\u043b\u0430\u0441\u0442\u044c \/ \u0423\u043a\u0440\u0430\u0457\u043d\u0430","ua_postCode":"69097","ua_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","costAssessment":"","otherObjectType":"","costDate_extendedstatus":"2","ua_houseNum_extendedstatus":"0","costAssessment_extendedstatus":"2","ua_housePartNum_extendedstatus":"1"},"1477315540116":{"city":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","person":"1","region":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","rights":{"1":{"citizen":"","ua_city":"","ua_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ua_lastname":"","ua_postCode":"","eng_fullname":"","eng_lastname":"","eng_postCode":"","rightBelongs":"1","ua_firstname":"","ukr_fullname":"","ukr_lastname":"","eng_firstname":"","ownershipType":"\u0421\u043f\u0456\u043b\u044c\u043d\u0430 \u0432\u043b\u0430\u0441\u043d\u0456\u0441\u0442\u044c","ua_middlename":"","ua_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ukr_firstname":"","eng_middlename":"","otherOwnership":"","ukr_middlename":"","rights_cityPath":"","ua_company_name":"","eng_company_name":"","ukr_company_name":"","percent-ownership":"33,33","ua_street_extendedstatus":"","ua_houseNum_extendedstatus":"","ua_postCode_extendedstatus":"","eng_postCode_extendedstatus":"","ua_middlename_extendedstatus":"","eng_middlename_extendedstatus":"","ukr_middlename_extendedstatus":"","ua_housePartNum_extendedstatus":"","ua_apartmentsNum_extendedstatus":""}},"country":"1","cityPath":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","costDate":"","district":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","postCode":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","totalArea":"69,02","ua_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","objectType":"\u041a\u0432\u0430\u0440\u0442\u0438\u0440\u0430","owningDate":"02.02.2001","ua_cityType":"\u0417\u0430\u043f\u043e\u0440\u0456\u0436\u0436\u044f \/ \u0417\u0430\u043f\u043e\u0440\u0456\u0437\u044c\u043a\u0430 \u041e\u0431\u043b\u0430\u0441\u0442\u044c \/ \u0423\u043a\u0440\u0430\u0457\u043d\u0430","ua_postCode":"69114","ua_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","costAssessment":"","otherObjectType":"","costDate_extendedstatus":"2","costAssessment_extendedstatus":"2","ua_housePartNum_extendedstatus":"1"}},"step_4":[],"step_5":[],"step_6":{"1477316195600":{"brand":"VOLKSWAGEN","model":"GOLF","person":"1","rights":{"1":{"citizen":"","ua_city":"","ua_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ua_lastname":"","ua_postCode":"","eng_fullname":"","eng_lastname":"","eng_postCode":"","rightBelongs":"1","ua_firstname":"","ukr_fullname":"","ukr_lastname":"","eng_firstname":"","ownershipType":"\u0412\u043b\u0430\u0441\u043d\u0456\u0441\u0442\u044c","ua_middlename":"","ua_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ukr_firstname":"","eng_middlename":"","otherOwnership":"","ukr_middlename":"","rights_cityPath":"","ua_company_name":"","eng_company_name":"","ukr_company_name":"","percent-ownership":"","ua_street_extendedstatus":"","ua_houseNum_extendedstatus":"","ua_postCode_extendedstatus":"","eng_postCode_extendedstatus":"","ua_middlename_extendedstatus":"","eng_middlename_extendedstatus":"","ukr_middlename_extendedstatus":"","ua_housePartNum_extendedstatus":"","ua_apartmentsNum_extendedstatus":""}},"costDate":"","objectType":"\u0410\u0432\u0442\u043e\u043c\u043e\u0431\u0456\u043b\u044c \u043b\u0435\u0433\u043a\u043e\u0432\u0438\u0439","owningDate":"27.12.2008","graduationYear":"2008","otherObjectType":"","costDate_extendedstatus":"2"}},"step_7":[],"step_8":[],"step_9":[],"step_10":[],"step_11":{"1477317085680":{"person":"1","rights":{"1":{"citizen":"","ua_city":"","ua_street":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ua_lastname":"","ua_postCode":"","eng_fullname":"","eng_lastname":"","eng_postCode":"","rightBelongs":"1","ua_firstname":"","ukr_fullname":"","ukr_lastname":"","eng_firstname":"","ownershipType":"\u0412\u043b\u0430\u0441\u043d\u0456\u0441\u0442\u044c","ua_middlename":"","ua_streetType":"[\u041a\u043e\u043d\u0444\u0456\u0434\u0435\u043d\u0446\u0456\u0439\u043d\u0430 \u0456\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0456\u044f]","ukr_firstname":"","eng_middlename":"","otherOwnership":"","ukr_middlename":"","rights_cityPath":"","ua_company_name":"","eng_company_name":"","ukr_company_name":"","percent-ownership":"","ua_street_extendedstatus":"","ua_houseNum_extendedstatus":"","ua_postCode_extendedstatus":"","eng_postCode_extendedstatus":"","ua_middlename_extendedstatus":"","eng_middlename_extendedstatus":"","ukr_middlename_extendedstatus":"","ua_housePartNum_extendedstatus":"","ua_apartmentsNum_extendedstatus":""}},"objectType":"\u0417\u0430\u0440\u043e\u0431\u0456\u0442\u043d\u0430 \u043f\u043b\u0430\u0442\u0430 \u043e\u0442\u0440\u0438\u043c\u0430\u043d\u0430 \u0437\u0430 \u043e\u0441\u043d\u043e\u0432\u043d\u0438\u043c \u043c\u0456\u0441\u0446\u0435\u043c \u0440\u043e\u0431\u043e\u0442\u0438","sizeIncome":"195926","incomeSource":"1","source_citizen":"","otherObjectType":"","source_ua_lastname":"","source_eng_fullname":"","source_ua_firstname":"","source_ukr_fullname":"","source_ua_middlename":"","source_ua_company_name":"","source_eng_company_name":"","source_ukr_company_name":"","source_ua_sameRegLivingAddress":""}},"step_12":[],"step_13":[],"step_14":[],"step_15":[],"step_16":[]},"server_info":{"apiPublic":{"exec_time":61.828,"memory_usage":754.41,"user_ip":"91.234.37.56"}}}))
                    .then(serverResponse => {
                        return serverResponse.data;
                    })
            });
        })
        .then(declarations => {
            // declarations = filter declarationType ===1
            return _.sortBy(declarations, declaration => -parseInt(_.get(declaration, "step_0.declarationYear1"), 10));
        })
        .then(declarations => {
            // return writeFile(`../../../edeclarations/${judge.key}.json`, JSON.stringify(declarations))
            //     .then(() => {
                    return declarations;
                // });
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
