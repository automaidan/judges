
const _ = require('lodash');
const toSafestNumber = require('../../helpers/to-safest-number');
const toSquareMeters = require('../../helpers/to-square-meters');
const toUAH = require('../../helpers/to-uah');

const getBelongingHash = belonging => belonging.owningDate +
  belonging.totalArea +
  belonging.ua_cityType +
  belonging.ua_postCode +
  belonging.country;

const percentOwnership = function percentOwnership(belonging, belongings) {
  const belongingHash = getBelongingHash(belonging);
  const groupedByHashesBelonging = _.groupBy(
    _.map(belongings, getBelongingHash),
    bHashe => bHashe === belongingHash,
  );

  const percentOwnershipLookup =
    _.get(belonging, 'rights.1') ||

    // Refactor: this is based on side-effect that non-belongings rights object has only one key
    _.first(_.values(_.get(belonging, 'rights')));

  // if percent is set
  if (_.get(percentOwnershipLookup, 'percent-ownership')) {
    return toSafestNumber(_.get(percentOwnershipLookup, 'percent-ownership')) / 100;
  }

  const percentOwnershipProposal = toSafestNumber(1 / _.size(_.values(_.get(belonging, 'rights'))));

  if (percentOwnershipProposal === 1 && _.size(groupedByHashesBelonging.true) > 1) {
    return toSafestNumber(1 / _.size(groupedByHashesBelonging.true));
  }

  return percentOwnershipProposal;
};

const belongsToDeclarant = belonging => _.includes(_.keys(belonging.rights), '1');

module.exports = {
  getYear: function getYear(declaration) {
    const yearVariant = _.get(declaration, 'step_0.changesYear');
    const yearVariant1 = _.get(declaration, 'step_0.declarationYear1');
    const yearVariant2 = _.get(declaration, 'step_0.declarationYear2');
    const yearVariant3 = _.get(declaration, 'step_0.declarationYear3');
    const yearVariant4 = _.get(declaration, 'step_0.declarationYear4');
    return toSafestNumber(yearVariant || yearVariant1 || yearVariant2 || yearVariant3 || yearVariant4);
  },

  // Add getFamilyBankAccount
  getBankAccount: function getBankAccount(declaration) {
    return toSafestNumber(_.reduce(_.get(declaration, 'step_12'), (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'банк')) {
        return sum + toUAH(belonging.sizeAssets, belonging.assetsCurrency);
      }
      return sum;
    }, 0));
  },

  // Add getFamilyCash
  getCash: function getCash(declaration) {
    return toSafestNumber(_.reduce(_.get(declaration, 'step_12'), (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'готівк')) {
        return sum + (toUAH(belonging.sizeAssets, belonging.assetsCurrency) * percentOwnership(belonging));
      }
      return sum;
    }, 0));
  },
  getIncome: function getIncome(declaration) {
    return toSafestNumber(_.reduce(_.get(declaration, 'step_11'), (sum, belonging) => {
      if (belongsToDeclarant(belonging)) {
        return sum + toSafestNumber(belonging.sizeIncome);
      }
      return sum;
    }, 0));
  },
  getCarAmount: function getCarAmount(declaration) {
    return _.reduce(_.get(declaration, 'step_6'), (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'авто')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getFlatArea: function getFlatArea(declaration) {
    return toSafestNumber(
      _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
        if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
          return sum + toSquareMeters(belonging.totalArea) * percentOwnership(belonging);
        }
        return sum;
      }, 0),
    );
  },
  getFlatAmount: function getFlatAmount(declaration) {
    return _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getHouseArea: function getHouseArea(declaration) {
    return toSafestNumber(
      _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
        if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
          return sum + toSquareMeters(belonging.totalArea) * percentOwnership(belonging);
        }
        return sum;
      }, 0),
    );
  },
  getHouseAmount: function getHouseAmount(declaration) {
    return _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getLandArea: function getLandArea(declaration) {
    return toSafestNumber(
      _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
        // "Земельна ділянка"
        if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
          return sum + toSquareMeters(belonging.totalArea) * percentOwnership(belonging);
        }
        return sum;
      }, 0),
    );
  },
  getLandAmount: function getLandAmount(declaration) {
    return _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
      // "Земельна ділянка"
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getFamilyIncome: function getFamilyIncome(declaration) {
    return toSafestNumber(_.reduce(_.get(declaration, 'step_11'), (sum, belonging) => {
      if (!belongsToDeclarant(belonging)) {
        return sum + toSafestNumber(belonging.sizeIncome);
      }
      return sum;
    }, 0));
  },
  getFamilyCarAmount: function getFamilyCarAmount(declaration) {
    return _.reduce(_.get(declaration, 'step_6'), (sum, belonging) => {
      if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'авто')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getFamilyFlatArea: function familyFlatArea(declaration) {
    const belongings = _.get(declaration, 'step_3');
    return toSafestNumber(
      _.reduce(belongings, (sum, belonging) => {
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
          return sum + toSquareMeters(belonging.totalArea) * percentOwnership(belonging, belongings);
        }
        return sum;
      }, 0),
    );
  },
  getFamilyFlatAmount: function familyFlatAmount(declaration) {
    return _.chain(_.get(declaration, 'step_3'))
      .reduce((belongingHashes, belonging) => {
        // "квартира"
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
          belongingHashes.push(getBelongingHash(belonging));
        }
        return belongingHashes;
      }, [])
      .uniq()
      .thru(belongingHashes => _.size(belongingHashes))
      .value();
  },
  getFamilyHouseArea: function getFamilyHouseArea(declaration) {
    const belongings = _.get(declaration, 'step_3');
    return toSafestNumber(
      _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
          return sum + toSquareMeters(belonging.totalArea) * percentOwnership(belonging, belongings);
        }
        return sum;
      }, 0),
    );
  },
  getFamilyHouseAmount: function getFamilyHouseAmount(declaration) {
    return _.chain(_.get(declaration, 'step_3'))
      .reduce((belongingHashes, belonging) => {
        // "будинок"
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
          belongingHashes.push(getBelongingHash(belonging));
        }
        return belongingHashes;
      }, [])
      .uniq()
      .thru(belongingHashes => _.size(belongingHashes))
      .value();
  },
  getFamilyLandArea: function getFamilyLandArea(declaration) {
    const belongings = _.get(declaration, 'step_3');
    return toSafestNumber(
      _.reduce(_.get(declaration, 'step_3'), (sum, belonging) => {
        // "Земельна ділянка"
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
          return sum + toSquareMeters(belonging.totalArea) * percentOwnership(belonging, belongings);
        }
        return sum;
      }, 0),
    );
  },
  getFamilyLandAmount: function getFamilyLandAmount(declaration) {
    return _.chain(_.get(declaration, 'step_3'))
      .reduce((belongingHashes, belonging) => {
        // "Земельна ділянка"
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
          belongingHashes.push(getBelongingHash(belonging));
        }
        return belongingHashes;
      }, [])
      .uniq()
      .thru(belongingHashes => _.size(belongingHashes))
      .value();
  },
};
