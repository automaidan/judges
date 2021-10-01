const _ = require("lodash");
const personModel = require("./input/person.json");
const statisticModel = require("./output/statistic.json");

const providers = {
  "declarations.com.ua.opendata": require("./providers/declarations.com.ua.opendata/analytics"),
};
function isEmptiness(judge) {
  return !judge.declarations || !_.size(judge.declarations);
}
module.exports = function perPersonAnalytics(person) {
  const result = [];

  if (isEmptiness(person)) {
    return result;
  }

  person.allDeclarations.forEach((declaration) => {
    const provider = providers[declaration.provider];
    const document = declaration.document;

    const year = provider.getYear(document);

    const findThisYear = {};
    findThisYear[statisticModel.year] = year;
    if (
      _.find(result, findThisYear) &&
      "public-api.nazk.gov.ua" !== declaration.provider
    ) {
      return;
    }

    const statistic = {};
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
    statistic[statisticModel.familyCarAmount] =
      provider.getFamilyCarAmount(document);
    statistic[statisticModel.familyFlatArea] =
      provider.getFamilyFlatArea(document);
    statistic[statisticModel.familyFlatAmount] =
      provider.getFamilyFlatAmount(document);
    statistic[statisticModel.familyHouseArea] =
      provider.getFamilyHouseArea(document);
    statistic[statisticModel.familyHouseAmount] =
      provider.getFamilyHouseAmount(document);
    statistic[statisticModel.familyLandArea] =
      provider.getFamilyLandArea(document);
    statistic[statisticModel.familyLandAmount] =
      provider.getFamilyLandAmount(document);

    if (year === 2015) {
      statistic[statisticModel.complaintAmount] = _.toSafeInteger(
        person["Кількість справ"]
      );
      statistic[statisticModel.complainsAmount] = _.toSafeInteger(
        person["Кількість скарг"]
      );
    }

    result.push(
      _.omitBy(statistic, (stat) => {
        return _.isUndefined(stat) || stat === 0;
      }),
    );
  });

  return _.sortBy(result, ["year"]);
};
