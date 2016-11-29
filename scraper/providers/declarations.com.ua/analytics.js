"use strict";
const _ = require("lodash");
const toSafestNumber = require("../../helpers/to-safest-number");
const toSquareMeters = require("../../helpers/to-square-meters");
const toUAH = require("../../helpers/to-uah");

module.exports = {
    getYear: function getYear(declaration) {
        return toSafestNumber(_.get(declaration, "intro.declaration_year"));
    },
    getIncome: function getIncome(declaration) {
        return toSafestNumber(_.get(declaration, "income.5.value"));
    },
    getFamilyIncome: function getFamilyIncome(declaration) {
        return toSafestNumber(_.get(declaration, "income.5.family"));
    },
    getLandArea: function getLandArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, "estate.23"), function (sum, land) {
            return sum + toSquareMeters(land.space, land.space_units);
        }, 0));
    },
    getLandAmount: function getLandAmount(declaration) {
        return _.size(_.get(declaration, "estate.23"));
    },
    getHouseArea: function getHouseArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, "estate.24"), function (sum, house) {
            return sum + toSquareMeters(house.space, house.space_units);
        }, 0));
    },
    getHouseAmount: function getHouseAmount(declaration) {
        return _.size(_.get(declaration, "estate.24"));
    },
    getFamilyHouseArea: function getFamilyHouseArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, "estate.30"), function (sum, house) {
            return sum + toSquareMeters(house.space, house.space_units);
        }, 0));
    },
    getFamilyHouseAmount: function getFamilyHouseAmount(declaration) {
        return _.size(_.get(declaration, "estate.30"));
    },
    getFlatArea: function getFlatArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, "estate.25"), function (sum, flat) {
            return sum + toSquareMeters(flat.space, flat.space_units);
        }, 0));
    },
    getFlatAmount: function getFlatAmount(declaration) {
        return _.size(_.get(declaration, "estate.25"));
    },
    getCarAmount: function getCarAmount(declaration) {
        return _.size(_.get(declaration, "vehicle.35"));
    },
    getBankAccount: function getBankAccount(declaration) {
        return _.reduce(_.get(declaration, "banks.45"), function (sum, bank) {
            return sum + toUAH(bank.sum, bank.sum_units);
        }, 0);
    }
};
