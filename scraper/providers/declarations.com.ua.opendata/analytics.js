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
    const step0 = _.get(declaration, 'unified_source.step_0') || _.get(declaration, 'unified_source.data.step_0');
    return toSafestNumber(
      step0.changesYear ||
      step0.declarationYear ||
      step0.declarationYear1 ||
      step0.declarationYear2 ||
      step0.declarationYear3 ||
      'Не вказано',
    );
  },

  // Add getFamilyBankAccount
  getBankAccount: function getBankAccount(declaration) {
    const step12 = _.get(declaration, 'unified_source.step_12') || _.get(declaration, 'unified_source.data.step_12');
    return toSafestNumber(_.reduce(step12, (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'банк')) {
        return sum + toUAH(belonging.sizeAssets, belonging.assetsCurrency);
      }
      return sum;
    }, 0));
  },

  // Add getFamilyCash
  getCash: function getCash(declaration) {
    const step12 = _.get(declaration, 'unified_source.step_12') || _.get(declaration, 'unified_source.data.step_12');
    return toSafestNumber(_.reduce(step12, (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'готівк')) {
        return sum + (toUAH(belonging.sizeAssets, belonging.assetsCurrency) * percentOwnership(belonging));
      }
      return sum;
    }, 0));
  },
  getIncome: function getIncome(declaration) {
    const step11 = _.get(declaration, 'unified_source.step_11') || _.get(declaration, 'unified_source.data.step_11');
    return toSafestNumber(_.reduce(step11, (sum, belonging) => {
      if (belongsToDeclarant(belonging)) {
        return sum + toSafestNumber(belonging.sizeIncome);
      }
      return sum;
    }, 0));
  },
  getCarAmount: function getCarAmount(declaration) {
    const step6 = _.get(declaration, 'unified_source.step_6') || _.get(declaration, 'unified_source.data.step_6');
    return _.reduce(step6, (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'авто')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getFlatArea: function getFlatArea(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return toSafestNumber(
      _.reduce(step3, (sum, belonging) => {
        if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
          return sum + (toSquareMeters(belonging.totalArea) * percentOwnership(belonging));
        }
        return sum;
      }, 0));
  },
  getFlatAmount: function getFlatAmount(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return _.reduce(step3, (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getHouseArea: function getHouseArea(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return toSafestNumber(
      _.reduce(step3, (sum, belonging) => {
        if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
          return sum + (toSquareMeters(belonging.totalArea) * percentOwnership(belonging));
        }
        return sum;
      }, 0));
  },
  getHouseAmount: function getHouseAmount(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return _.reduce(step3, (sum, belonging) => {
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getLandArea: function getLandArea(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return toSafestNumber(
      _.reduce(step3, (sum, belonging) => {
        // "Земельна ділянка"
        if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
          return sum + (toSquareMeters(belonging.totalArea) * percentOwnership(belonging));
        }
        return sum;
      }, 0));
  },
  getLandAmount: function getLandAmount(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return _.reduce(step3, (sum, belonging) => {
      // "Земельна ділянка"
      if (belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getFamilyIncome: function getFamilyIncome(declaration) {
    const step11 = _.get(declaration, 'unified_source.step_11') || _.get(declaration, 'unified_source.data.step_11');
    return toSafestNumber(_.reduce(step11, (sum, belonging) => {
      if (!belongsToDeclarant(belonging)) {
        return sum + toSafestNumber(belonging.sizeIncome);
      }
      return sum;
    }, 0));
  },
  getFamilyCarAmount: function getFamilyCarAmount(declaration) {
    const step6 = _.get(declaration, 'unified_source.step_6') || _.get(declaration, 'unified_source.data.step_6');
    return _.reduce(step6, (sum, belonging) => {
      if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'авто')) {
        return sum + 1;
      }
      return sum;
    }, 0);
  },
  getFamilyFlatArea: function familyFlatArea(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    const belongings = step3;
    return toSafestNumber(
      _.reduce(belongings, (sum, belonging) => {
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'квартира')) {
          return sum + (toSquareMeters(belonging.totalArea) * percentOwnership(belonging, belongings));
        }
        return sum;
      }, 0));
  },
  getFamilyFlatAmount: function familyFlatAmount(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return _.chain(step3)
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
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    const belongings = step3;
    return toSafestNumber(
      _.reduce(belongings, (sum, belonging) => {
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'будинок')) {
          return sum + (toSquareMeters(belonging.totalArea) * percentOwnership(belonging, belongings));
        }
        return sum;
      }, 0));
  },
  getFamilyHouseAmount: function getFamilyHouseAmount(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return _.chain(step3)
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
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    const belongings = step3;
    return toSafestNumber(
      _.reduce(belongings, (sum, belonging) => {
        // "Земельна ділянка"
        if (!belongsToDeclarant(belonging) && _.includes(_.lowerCase(belonging.objectType), 'земел')) {
          return sum + (toSquareMeters(belonging.totalArea) * percentOwnership(belonging, belongings));
        }
        return sum;
      }, 0));
  },
  getFamilyLandAmount: function getFamilyLandAmount(declaration) {
    const step3 = _.get(declaration, 'unified_source.step_3') || _.get(declaration, 'unified_source.data.step_3');
    return _.chain(step3)
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
