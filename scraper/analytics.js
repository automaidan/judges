"use strict";
const _ = require("lodash");
const statisticModel = require("./output/statistic.json");

function isEmptiness(judge) {
    return !judge.declarations || !_.size(judge.declarations);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getIndex = {
    landownerByLands: function landownerByLands(declaration) {
        var result = 0;

        if (!_.has(declaration, "estate.23") || _.isNull(_.get(declaration, "estate.23"))) {
            return result;
        }

        result = _.reduce(declaration.estate["23"], function (sum, land) {
            var space = _.toNumber(land.space);

            if (_.lowerCase(land.space_units) === "га") {
                space *= 10000;
            }
            //if (_.lowerCase(land.space_units) !== "га" || _.lowerCase(land.space_units) !== "м2" || land.space_units != "м²") {
            //    throw new Error("space unit " + land.space_units);
            //}

            return sum + space;
        }, result);

        return result;
    },

    commonFamilyIncome: function commonFamilyIncome(declaration) {
        var result = 0;

        return result + _.toNumber(declaration.income["5"].value) + _.toNumber(declaration.income["5"].family);
    },

    houseArea: function houseArea(declaration) {
        var result = 0;

        _.reduce(declaration.estate, function (sum, land) {
            return sum + _.toNumber(land.space);
        }, result);

        return result;
    }

};

module.exports = function analytics(judge) {
    if (isEmptiness(judge)) {
        return;
    }

    var result = [];

    judge.declarations.forEach((declaration) => {
        var statistic = {};
        statistic[statisticModel.year] = _.toSafeInteger(_.get(declaration, "intro.declaration_year"));
        statistic[statisticModel.income] = getRandomInt(20000, 1000000);
        statistic[statisticModel.familyIncome] = getRandomInt(20000, 1000000);
        statistic[statisticModel.landArea] = getRandomInt(0, 100000);
        statistic[statisticModel.landAmount] = getRandomInt(0, 10);
        statistic[statisticModel.houseArea] = getRandomInt(0, 1000);
        statistic[statisticModel.houseAmount] = getRandomInt(0, 5);
        statistic[statisticModel.flatArea] = getRandomInt(0, 300);
        statistic[statisticModel.flatAmount] = getRandomInt(0, 33);
        statistic[statisticModel.carAmount] = getRandomInt(0, 11);
        statistic[statisticModel.complaintAmount] = getRandomInt(0, 123);
        statistic[statisticModel.complainsAmount] = getRandomInt(0, 321);
        statistic[statisticModel.presentsEared] = getRandomInt(0, 1000000);
        statistic[statisticModel.bankAccount] = getRandomInt(0, 1000000);

        result.push(statistic);
    });

    return result;
};
