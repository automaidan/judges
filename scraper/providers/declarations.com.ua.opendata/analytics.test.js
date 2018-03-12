const test = require('tape');
const analytics = require('./analytics');

const nacp0447d77e7ae7465eafd88d59a07069c0 = require('./examples/nacp_0447d77e-7ae7-465e-afd8-8d59a07069c0.json');


test('public-api.nazk.gov.ua analytics check', (t) => {
  t.equal(analytics.getYear(nacp0447d77e7ae7465eafd88d59a07069c0), 2016, 'getYear');
  t.equal(analytics.getBankAccount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getBankAccount');
  t.equal(analytics.getCash(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getCash');
  t.equal(analytics.getCarAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getCarAmount');
  t.equal(analytics.getIncome(nacp0447d77e7ae7465eafd88d59a07069c0), 87885, 'getIncome');
  t.equal(analytics.getFlatArea(nacp0447d77e7ae7465eafd88d59a07069c0), 32.95, 'getFlatArea');
  t.equal(analytics.getFlatAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 1, 'getFlatAmount');
  t.equal(analytics.getHouseArea(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getHouseArea');
  t.equal(analytics.getHouseAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getHouseAmount');
  t.equal(analytics.getLandArea(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getLandArea');
  t.equal(analytics.getLandAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getLandAmount');
  t.equal(analytics.getFamilyIncome(nacp0447d77e7ae7465eafd88d59a07069c0), 55303, 'getFamilyIncome');
  t.equal(analytics.getFamilyCarAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyCarAmount');
  t.equal(analytics.getFamilyFlatArea(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyFlatArea');
  t.equal(analytics.getFamilyFlatAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyHouseAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyHouseAmount');
  t.equal(analytics.getFamilyFlatAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyLandArea(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyLandArea');
  t.equal(analytics.getFamilyLandAmount(nacp0447d77e7ae7465eafd88d59a07069c0), 0, 'getFamilyLandAmount');
  t.end();
});

