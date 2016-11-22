"use strict";
const _ = require("lodash");
const toSafestNumber = require("../../helpers/to-safest-number");
const toSquareMeters = require("../../helpers/to-square-meters");
const toUAH = require("../../helpers/to-uah");

module.exports = {
    getYear: function getYear(declaration) {
        const yearVariant1 = _.get(declaration, "step_0.changesYear");
        const yearVariant2 = _.get(declaration, "step_0.declarationYear1");
        return toSafestNumber(yearVariant1 || yearVariant2);
    },
    getIncome: function getIncome(declaration) {
        return _.reduce(_.get(declaration, "step_11"), function (sum, belonging) {
            return sum + toSafestNumber(belonging.sizeIncome);
        }, 0);
    },
    getFamilyIncome: function getFamilyIncome(declaration) {
    },
    getLandArea: function getLandArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.objectType === "Земельна ділянка") {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getLandAmount: function getLandAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.objectType === "Земельна ділянка") {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getHouseArea: function getHouseArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.objectType === "Житловий будинок") {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getHouseAmount: function getHouseAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.objectType === "Житловий будинок") {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getFamilyHouseArea: function getFamilyHouseArea(declaration) {
    },
    getFamilyHouseAmount: function getFamilyHouseAmount(declaration) {
    },
    getFlatArea: function getFlatArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.objectType === "Квартира") {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getFlatAmount: function getFlatAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.objectType === "Квартира") {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getCarAmount: function getCarAmount(declaration) {
        return _.reduce(_.get(declaration, "step_6"), function (sum, belonging) {
            if (belonging.objectType === "Автомобіль легковий") {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getBankAccount: function getBankAccount(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_12"), function (sum, belonging) {
            return sum + toUAH(belonging.sizeAssets, belonging.assetsCurrency);
        }, 0);
    }
};
