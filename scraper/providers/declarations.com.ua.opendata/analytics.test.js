const test = require('tape');
const analytics = require('./analytics');

const nacp0447d77e7ae7465eafd88d59a07069c0 = require('./examples/nacp_0447d77e-7ae7-465e-afd8-8d59a07069c0.json');
const nacp510ed202bcb8486ebea0a9750c9fdcb3 = require('./examples/nacp_510ed202-bcb8-486e-bea0-a9750c9fdcb3.json');
const nacp727b186f085741e694a4fd71475f580b = require('./examples/nacp_727b186f-0857-41e6-94a4-fd71475f580b.json');


test('declarations.com.ua.opendata nacp510ed202bcb8486ebea0a9750c9fdcb3 analytics check', (t) => {
  const declaration = nacp0447d77e7ae7465eafd88d59a07069c0;
  t.equal(analytics.getYear(declaration), 2016, 'getYear');
  t.equal(analytics.getBankAccount(declaration), 0, 'getBankAccount');
  t.equal(analytics.getCash(declaration), 0, 'getCash');
  t.equal(analytics.getCarAmount(declaration), 0, 'getCarAmount');
  t.equal(analytics.getIncome(declaration), 87885, 'getIncome');
  t.equal(analytics.getFlatArea(declaration), 32.95, 'getFlatArea');
  t.equal(analytics.getFlatAmount(declaration), 1, 'getFlatAmount');
  t.equal(analytics.getHouseArea(declaration), 0, 'getHouseArea');
  t.equal(analytics.getHouseAmount(declaration), 0, 'getHouseAmount');
  t.equal(analytics.getLandArea(declaration), 0, 'getLandArea');
  t.equal(analytics.getLandAmount(declaration), 0, 'getLandAmount');
  t.equal(analytics.getFamilyIncome(declaration), 55303, 'getFamilyIncome');
  t.equal(analytics.getFamilyCarAmount(declaration), 0, 'getFamilyCarAmount');
  t.equal(analytics.getFamilyFlatArea(declaration), 0, 'getFamilyFlatArea');
  t.equal(analytics.getFamilyFlatAmount(declaration), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyHouseAmount(declaration), 0, 'getFamilyHouseAmount');
  t.equal(analytics.getFamilyFlatAmount(declaration), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyLandArea(declaration), 0, 'getFamilyLandArea');
  t.equal(analytics.getFamilyLandAmount(declaration), 0, 'getFamilyLandAmount');
  t.end();
});


test('declarations.com.ua.opendata nacp510ed202bcb8486ebea0a9750c9fdcb3 analytics check', (t) => {
  const declaration = nacp510ed202bcb8486ebea0a9750c9fdcb3;
  t.equal(analytics.getYear(declaration), 2015, 'getYear');
  t.equal(analytics.getBankAccount(declaration), 0, 'getBankAccount');
  t.equal(analytics.getCash(declaration), 0, 'getCash');
  t.equal(analytics.getCarAmount(declaration), 2, 'getCarAmount');
  t.equal(analytics.getIncome(declaration), 267794, 'getIncome');
  t.equal(analytics.getFlatArea(declaration), 26.05, 'getFlatArea');
  t.equal(analytics.getFlatAmount(declaration), 1, 'getFlatAmount');
  t.equal(analytics.getHouseArea(declaration), 0, 'getHouseArea');
  t.equal(analytics.getHouseAmount(declaration), 0, 'getHouseAmount');
  t.equal(analytics.getLandArea(declaration), 1101, 'getLandArea');
  t.equal(analytics.getLandAmount(declaration), 1, 'getLandAmount');
  t.equal(analytics.getFamilyIncome(declaration), 46118, 'getFamilyIncome');
  t.equal(analytics.getFamilyCarAmount(declaration), 0, 'getFamilyCarAmount');
  t.equal(analytics.getFamilyFlatArea(declaration), 0, 'getFamilyFlatArea');
  t.equal(analytics.getFamilyFlatAmount(declaration), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyHouseAmount(declaration), 0, 'getFamilyHouseAmount');
  t.equal(analytics.getFamilyFlatAmount(declaration), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyLandArea(declaration), 0, 'getFamilyLandArea');
  t.equal(analytics.getFamilyLandAmount(declaration), 0, 'getFamilyLandAmount');
  t.end();
});



test('declarations.com.ua.opendata nacp727b186f085741e694a4fd71475f580b analytics check', (t) => {
  const declaration = nacp727b186f085741e694a4fd71475f580b;
  t.equal(analytics.getYear(declaration), 2015, 'getYear');
  t.equal(analytics.getBankAccount(declaration), 0, 'getBankAccount');
  t.equal(analytics.getCash(declaration), 0, 'getCash');
  t.equal(analytics.getCarAmount(declaration), 2, 'getCarAmount');
  t.equal(analytics.getIncome(declaration), 267794, 'getIncome');
  t.equal(analytics.getFlatArea(declaration), 26.05, 'getFlatArea');
  t.equal(analytics.getFlatAmount(declaration), 1, 'getFlatAmount');
  t.equal(analytics.getHouseArea(declaration), 0, 'getHouseArea');
  t.equal(analytics.getHouseAmount(declaration), 0, 'getHouseAmount');
  t.equal(analytics.getLandArea(declaration), 1101, 'getLandArea');
  t.equal(analytics.getLandAmount(declaration), 1, 'getLandAmount');
  t.equal(analytics.getFamilyIncome(declaration), 46118, 'getFamilyIncome');
  t.equal(analytics.getFamilyCarAmount(declaration), 0, 'getFamilyCarAmount');
  t.equal(analytics.getFamilyFlatArea(declaration), 0, 'getFamilyFlatArea');
  t.equal(analytics.getFamilyFlatAmount(declaration), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyHouseAmount(declaration), 0, 'getFamilyHouseAmount');
  t.equal(analytics.getFamilyFlatAmount(declaration), 0, 'getFamilyFlatAmount');
  t.equal(analytics.getFamilyLandArea(declaration), 0, 'getFamilyLandArea');
  t.equal(analytics.getFamilyLandAmount(declaration), 0, 'getFamilyLandAmount');
  t.end();
});

