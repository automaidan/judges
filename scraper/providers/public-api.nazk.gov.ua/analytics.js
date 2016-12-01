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
    getBankAccount: function getBankAccount(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_12"), function (sum, belonging) {
            //belonging.person === "1" &&
            if (_.includes(_.lowerCase(belonging.objectType), "банк")) {
                return sum + toUAH(belonging.sizeAssets, belonging.assetsCurrency);
            }
            return sum;
        }, 0);
    },
    getCash: function getCash() {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_12"), function (sum, belonging) {
            //belonging.person === "1" &&
            if (_.includes(_.lowerCase(belonging.objectType), "готівк")) {
                return sum + toUAH(belonging.sizeAssets, belonging.assetsCurrency);
            }
            return sum;
        }, 0);
    },
    getIncome: function getIncome(declaration) {
        return _.reduce(_.get(declaration, "step_11"), function (sum, belonging) {
            if (belonging.person === "1") {
                return sum + toSafestNumber(belonging.sizeIncome);
            }
            return sum;
        }, 0);
    },
    getCarAmount: function getCarAmount(declaration) {
        return _.reduce(_.get(declaration, "step_6"), function (sum, belonging) {
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "авто")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getFlatArea: function getFlatArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "квартира")) {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getFlatAmount: function getFlatAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "квартира")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getHouseArea: function getHouseArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "будинок")) {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getHouseAmount: function getHouseAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "будинок")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getLandArea: function getLandArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            // "Земельна ділянка"
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "земел")) {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getLandAmount: function getLandAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            // "Земельна ділянка"
            if (belonging.person === "1" && _.includes(_.lowerCase(belonging.objectType), "земел")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getFamilyIncome: function getFamilyIncome(declaration) {
        return _.reduce(_.get(declaration, "step_11"), function (sum, belonging) {
            if (belonging.person !== "1") {
                return sum + toSafestNumber(belonging.sizeIncome);
            }
            return sum;
        }, 0);
    },
    getFamilyCarAmount: function getFamilyCarAmount(declaration) {
        return _.reduce(_.get(declaration, "step_6"), function (sum, belonging) {
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "авто")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getFamilyFlatArea: function familyFlatArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "квартира")) {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getFamilyFlatAmount: function familyFlatAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "квартира")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getFamilyHouseArea: function getFamilyHouseArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "будинок")) {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getFamilyHouseAmount: function getFamilyHouseAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "будинок")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    },
    getFamilyLandArea: function getFamilyLandArea(declaration) {
        //TODO multiply by belonging.rights.1.percent-ownership
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            // "Земельна ділянка"
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "земел")) {
                return sum + toSquareMeters(belonging.totalArea, "");
            }
            return sum;
        }, 0);
    },
    getFamilyLandAmount: function getFamilyLandAmount(declaration) {
        return _.reduce(_.get(declaration, "step_3"), function (sum, belonging) {
            // "Земельна ділянка"
            if (belonging.person !== "1" && _.includes(_.lowerCase(belonging.objectType), "земел")) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
};
