'use strict';
const _ = require('lodash');
const toSafestNumber = require('../../helpers/to-safest-number');
const toSquareMeters = require('../../helpers/to-square-meters');
const toUAH = require('../../helpers/to-uah');

module.exports = {
    getYear: function getYear(declaration) {
        return toSafestNumber(_.get(declaration, 'intro.declaration_year'));
    },
    getBankAccount: function getBankAccount(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'banks.45'), function (sum, bank) {
            return sum + toUAH(bank.sum, bank.sum_units);
        }, 0));
    },
    getCash: function getCash() {
    },
    getIncome: function getIncome(declaration) {
        return toSafestNumber(_.get(declaration, 'income.5.value'));
    },
    getCarAmount: function getCarAmount(declaration) {
        return _.size(_.get(declaration, 'vehicle.35'));
    },
    getFlatArea: function getFlatArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'estate.25'), function (sum, flat) {
            return sum + toSquareMeters(flat.space, flat.space_units);
        }, 0));
    },
    getFlatAmount: function getFlatAmount(declaration) {
        return _.size(_.get(declaration, 'estate.25'));
    },
    getHouseArea: function getHouseArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'estate.24'), function (sum, house) {
            return sum + toSquareMeters(house.space, house.space_units);
        }, 0));
    },
    getHouseAmount: function getHouseAmount(declaration) {
        return _.size(_.get(declaration, 'estate.24'));
    },
    getLandArea: function getLandArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'estate.23'), function (sum, land) {
            return sum + toSquareMeters(land.space, land.space_units);
        }, 0));
    },
    getLandAmount: function getLandAmount(declaration) {
        return _.size(_.get(declaration, 'estate.23'));
    },
    getFamilyIncome: function getFamilyIncome(declaration) {
        return toSafestNumber(_.get(declaration, 'income.5.family'));
    },
    getFamilyCarAmount: function getFamilyCarAmount(declaration) {
    },
    getFamilyFlatArea: function familyFlatArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'estate.31'), function (sum, flat) {
            return sum + toSquareMeters(flat.space, flat.space_units);
        }, 0));
    },
    getFamilyFlatAmount: function familyFlatAmount(declaration) {
        return _.size(_.get(declaration, 'estate.31'));
    },
    getFamilyHouseArea: function getFamilyHouseArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'estate.30'), function (sum, house) {
            return sum + toSquareMeters(house.space, house.space_units);
        }, 0));
    },
    getFamilyHouseAmount: function getFamilyHouseAmount(declaration) {
        return _.size(_.get(declaration, 'estate.30'));
    },
    getFamilyLandArea: function getFamilyLandArea(declaration) {
        return toSafestNumber(_.reduce(_.get(declaration, 'estate.29'), function (sum, land) {
            return sum + toSquareMeters(land.space, land.space_units);
        }, 0));
    },
    getFamilyLandAmount: function getFamilyLandAmount(declaration) {
        return _.size(_.get(declaration, 'estate.29'));
    }
};
