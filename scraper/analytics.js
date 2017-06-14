"use strict";
let _ = require("lodash");
const personModel = require("./input/person.json");
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

        let result = [];

        judge.allDeclarations.forEach((declaration) => {
            const provider = providers[declaration.provider];
            const document = declaration.document;

            const year = provider.getYear(document);

            const findThisYear = {};
            findThisYear[statisticModel.year] = year;
            if (_.find(result, findThisYear) && "public-api.nazk.gov.ua" !== declaration.provider) {
                return;
            }

            let statistic = {};
            statistic[statisticModel.year] = year;
            statistic[statisticModel.bankAccount] = provider.getBankAccount(document);
            statistic[statisticModel.cash] = provider.getCash(document);
            statistic[statisticModel.income] = provider.getIncome(document);
            statistic[statisticModel.carAmount] = provider.getCarAmount(document);
            statistic[statisticModel.flatArea] = provider.getFlatArea(document);
            statistic[statisticModel.flatAmount] = provider.getFlatAmount(document);
            statistic[statisticModel.houseArea] = provider.getHouseArea(document);
            statistic[statisticModel.houseAmount] = provider.getHouseAmount(document);
            statistic[statisticModel.landArea] = provider.getLandArea(document);
            statistic[statisticModel.landAmount] = provider.getLandAmount(document);
            statistic[statisticModel.familyIncome] = provider.getFamilyIncome(document);
            statistic[statisticModel.familyCarAmount] = provider.getFamilyCarAmount(document);
            statistic[statisticModel.familyFlatArea] = provider.getFamilyFlatArea(document);
            statistic[statisticModel.familyFlatAmount] = provider.getFamilyFlatAmount(document);
            statistic[statisticModel.familyHouseArea] = provider.getFamilyHouseArea(document);
            statistic[statisticModel.familyHouseAmount] = provider.getFamilyHouseAmount(document);
            statistic[statisticModel.familyLandArea] = provider.getFamilyLandArea(document);
            statistic[statisticModel.familyLandAmount] = provider.getFamilyLandAmount(document);

            if (2015 === year) {
                statistic[statisticModel.complaintAmount] = _.toSafeInteger(judge["Кількість справ"]);
                statistic[statisticModel.complainsAmount] = _.toSafeInteger(judge["Кількість скарг"]);
            }

            result.push(_.omitBy(statistic, (stat) => {
                return _.isUndefined(stat) || stat === 0;
            }));
        });

        result = _.sortBy(result, ['year']);

        judge[personModel.analytics] = result;

        return judge;
    });
};
