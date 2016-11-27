"use strict";
let _ = require("lodash");
const inJudgeModel = require("./input/judge.json");
const statisticModel = require("./output/statistic.json");
let providers = {
    "public-api.nazk.gov.ua": require('./providers/public-api.nazk.gov.ua/analytics'),
    "declarations.com.ua": require('./providers/declarations.com.ua/analytics')
};
function isEmptiness(judge) {
    return !judge.declarations || !_.size(judge.declarations);
}
module.exports = function analytics(judges) {
    console.log('Analyze Them like Robert De Niro did');
    return _.map(judges, function (judge) {

        if (isEmptiness(judge)) {
            return judge;
        }

        var result = [];

        judge.declarations.forEach((declaration) => {
            const provider = providers[declaration.provider];
            const document = declaration.document;

            const year = provider.getYear(document);

            const findThisYear = {};
            findThisYear[statisticModel.year] = year;
            if (_.find(result, findThisYear)) {
                return;
            }

            let statistic = {};
            statistic[statisticModel.year] = year;
            statistic[statisticModel.income] = provider.getIncome(document);
            statistic[statisticModel.familyIncome] = provider.getFamilyIncome(document);
            statistic[statisticModel.landArea] = provider.getLandArea(document);
            statistic[statisticModel.landAmount] = provider.getLandAmount(document);
            statistic[statisticModel.houseArea] = provider.getHouseArea(document);
            statistic[statisticModel.houseAmount] = provider.getHouseAmount(document);
            statistic[statisticModel.familyHouseArea] = provider.getFamilyHouseArea(document);
            statistic[statisticModel.familyHouseAmount] = provider.getFamilyHouseAmount(document);
            statistic[statisticModel.flatArea] = provider.getFlatArea(document);
            statistic[statisticModel.flatAmount] = provider.getFlatAmount(document);
            statistic[statisticModel.carAmount] = provider.getCarAmount(document);
            statistic[statisticModel.bankAccount] = provider.getBankAccount(document);

            if (2015 === year) {
                statistic[statisticModel.complaintAmount] = _.toSafeInteger(judge["Кількість справ"]);
                statistic[statisticModel.complainsAmount] = _.toSafeInteger(judge["Кількість скарг"]);
            }

            result.push(_.omitBy(statistic, (stat) => {
                return _.isUndefined(stat) || stat == 0;
            }));
        });

        judge[inJudgeModel.analytics] = result;

        return judge;
    });
};


//console.log(analytics({"Department":"Романівський районний суд Житомирської області","Region":"Житомирська область","Position":"Суддя Романівського районного суду Житомирської області","Name":"Бабич Сергій Васильович","Link":"https://drive.google.com/open?id=0BygiyWAl79DMQnBsVENuVXRTQVk","Note":"У меня","AdditionalNote":"","field8":"","Link 2015":"","field10":"","Кількість справ":"","Оскаржені":"","Кількість скарг":0,"Кількість дисциплінарних стягнень":"","Клейма":"","Фото":"","Як живе":"","key":"babich_sergiy_vasilovich","declarations":[{"vehicle":{"35":[{"brand_unclear":false,"brand":"Mitsubishi Pajero Sport","sum_rent":"","year":"2011","sum_comment":"","sum_rent_comment":"","brand_info_unclear":false,"brand_info":"2477 куб. см.","sum":""}]},"general":{"family_raw":"","post":{"region":"Житомирська область","post":"заступник голови романівського районного суду житомирської області","region_hidden":false,"office_unclear":false,"office":"Загальний місцевий суд","post_unclear":false,"region_unclear":false,"office_hidden":false},"patronymic":"Васильович","inn":"","full_name":"Бабич Сергій Васильович","inn_hidden":true,"inn_unclear":false,"full_name_suggest":{"output":"Бабич Сергій Васильович","input":["Бабич Сергій Васильович","Сергій Васильович Бабич","Сергій Бабич"]},"last_name":"Бабич","last_name_unclear":false,"family":[{"relations_hidden":false,"relations":"Подружжя","inn_hidden":true,"family_name":"Бабич О. С","relations_other":"","inn":"","name_hidden":false,"inn_unclear":false,"name_unclear":false,"relations_unclear":false},{"family_name":"Бабич О. С","relations":"Дитина","inn_hidden":true,"relations_other":"","inn":"","name_hidden":false,"inn_unclear":false,"name_unclear":false,"relations_unclear":false},{"family_name":"Бабич Ф. С","relations":"Дитина","inn_hidden":true,"relations_other":"","inn":"","inn_unclear":false,"name_unclear":true,"name_hidden":false}],"name":"Сергій","last_name_hidden":false,"patronymic_unclear":false,"addresses":[{"place_address_unclear":false,"place_unclear":false,"place_city":"Скраглівка","place_address_hidden":true,"place_city_type_unclear":false,"place":"Житомирська область","place_district":"Бердичівський","place_district_unclear":false,"place_city_hidden":false,"place_hidden":false,"place_city_type_hidden":false,"place_district_hidden":false,"place_city_type":"Село","place_city_unclear":true,"place_address":""}],"name_unclear":false,"name_hidden":false},"declaration":{"additional_info":"","notfull_lostpages":"","additional_info_text":"","date":"2015-03-17T00:00:00","notfull":"","url":"http://unshred.it/static/declarations/chosen_ones/mega_batch/babych_serhii_vasylovych.pdf"},"estate":{"23":[{"space_units_unclear":false,"address":"Бердичівський р-н, с. Велика П'ятигірка","space_hidden":false,"costs_hidden":false,"space_units":"м²","costs_comment":"","space":"2800","costs_rent_comment":"","region_hidden":false,"region":"Житомирська область","space_unclear":false,"address_hidden":false,"costs_rent_hidden":false,"space_comment":"","costs":"","space_units_hidden":false,"costs_rent":""}],"25":[{"space_comment_unclear":false,"address":"смт. Романів","costs_rent_comment_hidden":false,"space_hidden":false,"costs_hidden":false,"space_units":"м²","region_unclear":false,"address_unclear":true,"costs_rent_hidden":false,"space":"61.6","costs_rent_comment":"","costs_comment_hidden":false,"region_hidden":false,"region":"","space_unclear":true,"costs_comment":"","address_hidden":false,"space_comment":"","costs":"","space_units_hidden":false,"costs_rent":"4800"}],"27":[{"address_unclear":true,"address":"смт. Романів","costs_comment":"","costs_rent_comment_hidden":false,"costs_hidden":false,"space_units":"м²","costs_rent_hidden":false,"space":"20","costs_rent_comment":"","costs_comment_hidden":false,"region":"Житомирська область","space_unclear":false,"address_hidden":false,"region_hidden":false,"space_comment":"","costs":"","costs_rent":"1200"}]},"intro":{"isnotdeclaration":"","declaration_year_unclear":false,"declaration_year":"2014"},"source":"VULYK","banks":{"45":[{"sum_foreign_units":"UAH","sum_units":"UAH","sum_foreign_comment":"","sum_unclear":false,"sum_foreign_unclear":false,"sum_hidden":false,"sum_comment":"","sum_foreign":"","sum":"3100","sum_foreign_hidden":false,"sum_comment_hidden":false}],"46":[{"sum_foreign_units":"UAH","sum_units":"UAH","sum_comment_hidden":false,"sum_comment":"","sum_foreign":"","sum_foreign_comment":"","sum":"3100"}]},"id":"vulyk_63_129","liabilities":{"54":{"sum_comment":"","sum_foreign":"","sum_unclear":false,"sum_foreign_comment":"","sum":""},"55":{"sum_comment":"","sum_foreign":"","sum_foreign_comment":"","sum":""},"56":{"sum_foreign_comment":"","sum_comment":"","sum_unclear":true,"sum_foreign":"","sum":"5400"},"57":{"sum_foreign_comment":"","sum_comment_hidden":false,"sum_unclear":false,"sum_comment":"","sum_foreign":"","sum":""},"58":{"sum_comment":"","sum_foreign":"","sum_comment_hidden":false,"sum_foreign_comment":"","sum":""},"59":{"sum_comment":"","sum_foreign":"","sum_foreign_comment":"","sum":""},"60":{"sum_comment_unclear":false,"sum_comment":"","sum_foreign":"","sum_foreign_comment":"","sum":""},"61":{"sum_comment":"","sum_foreign":"","sum_unclear":false,"sum_foreign_comment":"","sum":""},"62":{"sum_comment":"","sum_foreign":"","sum_unclear":false,"sum_foreign_comment":"","sum":""},"63":{"sum_comment_hidden":false,"sum_unclear":false,"sum_comment":"","sum_foreign":"","sum_hidden":false,"sum_foreign_comment":"","sum":""},"64":{"sum_comment":"","sum_foreign":"","sum_comment_hidden":false,"sum_foreign_comment":"","sum":""}},"income":{"5":{"value":"372586","comment":"","value_unclear":false,"value_hidden":false,"family_unclear":false,"comment_hidden":false,"family":"46588","family_hidden":false,"family_comment":""},"6":{"value":"226123","comment":"","comment_unclear":false,"value_unclear":false,"family_unclear":false,"family":"46588","family_hidden":false,"family_comment":""},"7":{"value":"","comment":"","value_hidden":false,"source_name_unclear":false,"source_name":"","source_name_hidden":false,"family":"","family_comment":""},"8":{"value":"","comment":"","value_hidden":false,"family":"","family_hidden":false,"family_comment":""},"9":{"value":"463","comment":"","value_unclear":false,"value_hidden":false,"family_unclear":false,"family":"","family_hidden":false,"family_comment":""},"10":{"value":"","comment":"","family":"","family_comment":""},"11":{"value":"","comment":"","family":"","family_comment":""},"12":{"value":"","comment":"","family":"","family_comment":""},"13":{"value":"","comment":"","family":"","family_comment":""},"14":{"value":"","comment":"","family":"","family_comment":""},"15":{"value":"","comment":"","family":"","family_comment":""},"16":{"value":"146000","comment":"","value_unclear":false,"family_unclear":false,"family":"","family_comment":""},"17":{"value":"","comment":"","family":"","family_comment":""},"18":{"value":"","comment":"","family":"","family_comment":""},"19":{"value":"","comment":"","comment_unclear":false,"family":"","family_comment":""},"20":{"value":"","comment":"","comment_unclear":false,"value_unclear":false,"value_hidden":false,"family_unclear":false,"comment_hidden":false,"family_comment_unclear":false,"family":"","family_hidden":false,"family_comment":""}}}],"declarationsLength":1}))
